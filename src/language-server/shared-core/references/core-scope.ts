import { AstNode, AstNodeDescription, DefaultScopeProvider, ReferenceInfo, Scope, findRootNode, getDocument } from "langium";
import { QualifiedNameProvider } from "./core-naming";
import { BoundaryOperation, isBoundaryObject } from "../../generated/ast";
import { ImportsContainer, isImportsContainer } from "../grammar/core-fragments";
import { CrystalCoreServices } from "../crystal-core-services";


export abstract class CrystalCoreScopeProvider extends DefaultScopeProvider {

    qualifiedNameProvider: QualifiedNameProvider;

    constructor(services: CrystalCoreServices) {
        super(services);
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
    }

    protected override getGlobalScope(referenceType: string, _context: ReferenceInfo): Scope {
        const globalScope = super.getGlobalScope(referenceType, _context);

        if (this.isImportStatement(_context)) {
            return globalScope;
        }

        const rootNode = findRootNode(_context.container);

        if (this.isImportsContainer(rootNode)) {
            const importsScopeElements = this.calculateImportedElementsForReferenceType(rootNode, referenceType);

            return this.createScope(importsScopeElements, globalScope);
        }

        return globalScope;
    }


    private calculateImportedElementsForReferenceType(rootNode: ImportsContainer, refType: string)
        : AstNodeDescription[] {
        const importedNodes: AstNodeDescription[] = [];

        rootNode.imports.forEach((importStatament) => {

            if (importStatament.$nodeDescription) {
                const importedNodeDescription = importStatament.$nodeDescription;

                if (refType === importedNodeDescription.type) {
                    importedNodes.push({
                        ...importedNodeDescription,
                        name: this.qualifiedNameProvider.getSimpleName(importedNodeDescription.name)
                    });
                } else if (refType === BoundaryOperation) {
                    //HACK: Relying on the fact that all imports are already resolved => type is not undefined
                    //HACK: Relying also on the fact that BoundaryOperations are only contained in the BoundaryObject
                    if (isBoundaryObject(importStatament.ref)) {
                        const boundaryObject = importStatament.ref
                        const boundaryObjectDocument = getDocument(boundaryObject)
                        const boundaryObjectName = this.nameProvider.getName(boundaryObject)

                        boundaryObject.operations.forEach((operation) => {
                            const operationNameInObject = this.qualifiedNameProvider.qualifyBy(boundaryObjectName, operation)
                            importedNodes.push(this.descriptions.createDescription(operation, operationNameInObject, boundaryObjectDocument));
                        });
                    }
                }
            }
        });
        return importedNodes;
    }

    protected isImportsContainer(rootNode: AstNode): rootNode is ImportsContainer {
        return isImportsContainer(rootNode) && this.isValidRootNode(rootNode);
    }

    protected abstract isImportStatement(_context: ReferenceInfo): boolean;
    protected abstract isValidRootNode(rootNode: ImportsContainer): boolean;
}