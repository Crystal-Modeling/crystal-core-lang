import { AstNodeDescription, DefaultScopeComputation, LangiumDocument, ReferenceInfo, interruptAndCheck, streamAllContents } from "langium";
import { CancellationToken } from 'vscode-jsonrpc';
import { QualifiedNameProvider } from "../crystal-core/naming";
import { CrystalCoreScopeProvider } from "../crystal-core/scope";
import { Module, isBoundaryObject, isModule } from "../generated/ast";
import { ClassifierServices } from "./classifier-module";

export class ClassifierScopeProvider extends CrystalCoreScopeProvider {

    protected override isImportStatement(_context: ReferenceInfo): boolean {
        const importsModuleProp: keyof Module = 'imports';

        return isModule(_context.container) && _context.property === importsModuleProp;
    }

}

export class ClassifierScopeComputation extends DefaultScopeComputation {

    qualifiedNameProvider: QualifiedNameProvider;

    constructor(services: ClassifierServices) {
        super(services);
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
    }

    /**
     * Exports root elements and `BehaviorOperation`s with their qualified names.
     */
    override async computeExports(document: LangiumDocument, cancelToken = CancellationToken.None): Promise<AstNodeDescription[]> {
        const descr: AstNodeDescription[] = [];
        for (const node of streamAllContents(document.parseResult.value)) {
            await interruptAndCheck(cancelToken);
            if (isModule(node.$container) || isBoundaryObject(node.$container)) {
                let name = this.nameProvider.getName(node);
                if (name) {
                    name = this.qualifiedNameProvider.getQualifiedName(node.$container, name);
                    descr.push(this.descriptions.createDescription(node, name, document));
                }
            }
        }
        return descr;
    }
}
