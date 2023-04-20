import { AstNode, AstNodeDescription, DefaultScopeProvider, ReferenceInfo, Scope, findRootNode } from "langium";
import { QualifiedNameProvider } from "../crystal-core/naming";
import { BoundaryObject, BoundaryOperation } from "../generated/ast";
import { ImportsContainer, isImportsContainer } from "./fragments";
import { CrystalCoreServices } from "./services";


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
            const importsScope = this.calculateImportsScope(rootNode, referenceType);

            return this.createScope(importsScope, globalScope);
        }

        return globalScope;
    }


    private calculateImportsScope(rootNode: ImportsContainer, referenceType: string): AstNodeDescription[] {
        const importedNodes: AstNodeDescription[] = [];

        rootNode.imports.forEach((importStatament) => {

            if (importStatament.$nodeDescription) {
                const importedNodeDescription = importStatament.$nodeDescription;

                if (referenceType === importedNodeDescription.type) {
                    importedNodes.push({
                        ...importedNodeDescription,
                        name: this.qualifiedNameProvider.getSimpleName(importedNodeDescription.name)
                    });
                } else if (referenceType === BoundaryOperation && importedNodeDescription.type === BoundaryObject) {
                    // Imports are already resolved, using computeExports -> hence the name is fully qualified name
                    const importedBOQualifiedName = importedNodeDescription.name

                    this.indexManager.allElements(BoundaryOperation)
                        .filter((boundaryOperation) => boundaryOperation.name.startsWith(importedBOQualifiedName))
                        .forEach((boundaryOperationNodeDescription) => {
                            importedNodes.push({
                                ...boundaryOperationNodeDescription,
                                name: this.qualifiedNameProvider
                                    .getRelativeName(importedBOQualifiedName, boundaryOperationNodeDescription.name)
                            });
                        });

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