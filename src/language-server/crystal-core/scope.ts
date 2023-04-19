import { AstNodeDescription, DefaultScopeProvider, ReferenceInfo, Scope } from "langium";
import { QualifiedNameProvider } from "../crystal-core/naming";
import { isImportsContainer } from "./fragments";
import { CrystalCoreServices } from "./services";


export abstract class CrystalCoreScopeProvider extends DefaultScopeProvider {

    qualifiedNameProvider: QualifiedNameProvider;

    constructor(services: CrystalCoreServices) {
        super(services);
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
    }

    protected override getGlobalScope(referenceType: string, _context: ReferenceInfo): Scope {
        if (this.isImportStatement(_context)) {
            return super.getGlobalScope(referenceType, _context);
        }

        let rootContainer = _context.container;
        while (rootContainer.$container) {
            rootContainer = rootContainer.$container;
        }

        if (isImportsContainer(rootContainer)) {
            const importedNodes: AstNodeDescription[] = [];

            rootContainer.imports.forEach((importStatament) => {
                let nodeDescription = importStatament.$nodeDescription;

                if (nodeDescription) {
                    importedNodes.push({
                        ...nodeDescription,
                        name: this.qualifiedNameProvider.getSimpleName(nodeDescription.name)
                    });
                }
            });

            return this.createScope(importedNodes, super.getGlobalScope(referenceType, _context));
        }

        return super.getGlobalScope(referenceType, _context);
    }

    protected abstract isImportStatement(_context: ReferenceInfo): boolean;
}