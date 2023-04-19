import { AstNodeDescription, DefaultScopeComputation, DefaultScopeProvider, LangiumDocument, ReferenceInfo, Scope, interruptAndCheck, streamAllContents } from "langium";
import { CancellationToken } from 'vscode-jsonrpc';
import { QualifiedNameProvider } from "../crystal-core/naming";
import { Module, isModule } from "../generated/ast";
import { ClassifierServices } from "./classifier-module";

export class ClassifierScopeComputation extends DefaultScopeComputation {

    qualifiedNameProvider: QualifiedNameProvider;

    constructor(services: ClassifierServices) {
        super(services);
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
    }

    /**
     * Exports `Classifier`s with their qualified names.
     */
    override async computeExports(document: LangiumDocument, cancelToken = CancellationToken.None): Promise<AstNodeDescription[]> {
        const descr: AstNodeDescription[] = [];
        for (const node of streamAllContents(document.parseResult.value)) {
            await interruptAndCheck(cancelToken);
            if (isModule(node.$container)) {
                let name = this.nameProvider.getName(node);
                if (name) {
                    name = this.qualifiedNameProvider.getQualifiedName(node.$container.package, name);
                    descr.push(this.descriptions.createDescription(node, name, document));
                }
            }
        }
        return descr;
    }
}

export class ClassifierScopeProvider extends DefaultScopeProvider {

    qualifiedNameProvider: QualifiedNameProvider;

    constructor(services: ClassifierServices) {
        super(services);
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
    }


    protected override getGlobalScope(referenceType: string, _context: ReferenceInfo): Scope {
        const importsModuleProp: keyof Module = 'imports';

        if (isModule(_context.container) && _context.property === importsModuleProp) {
            return super.getGlobalScope(referenceType, _context);
        }

        let rootContainer = _context.container;
        while (rootContainer.$container) {
            rootContainer = rootContainer.$container;
        }

        if (isModule(rootContainer)) {
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
}
