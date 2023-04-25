import { AstNode, AstNodeDescription, DefaultScopeComputation, ReferenceInfo, interruptAndCheck, streamAllContents } from "langium";
import { CancellationToken } from 'vscode-jsonrpc';
import { Module, isAbstractElement, isBoundaryOperation, isModule } from "../../generated/ast";
import { ImportsContainer } from "../../shared-core/grammar/core-fragments";
import { QualifiedNameProvider } from "../../shared-core/references/core-naming";
import { CrystalCoreScopeProvider } from "../../shared-core/references/core-scope";
import { ClassifierServices } from "../classifier-module";
import { ClassifierDocument } from "../workspace/documents";

export class ClassifierScopeProvider extends CrystalCoreScopeProvider {

    protected override isImportStatement(_context: ReferenceInfo): boolean {
        const importsModuleProp: keyof Module = 'imports';

        return isModule(_context.container) && _context.property === importsModuleProp;
    }

    protected override isValidRootNode(rootNode: ImportsContainer): boolean {
        return isModule(rootNode);
    }

}

export class ClassifierScopeComputation extends DefaultScopeComputation {

    qualifiedNameProvider: QualifiedNameProvider;

    constructor(services: ClassifierServices) {
        super(services);
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
    }


    /**
     * Iterate through **all** elements with their qualified names.
     */
    override async computeExports(document: ClassifierDocument, cancelToken = CancellationToken.None): Promise<AstNodeDescription[]> {
        const descr: AstNodeDescription[] = [];
        for (const node of streamAllContents(document.parseResult.value)) {
            await interruptAndCheck(cancelToken);
            this.exportNode(node, descr, document);
        }
        return descr;
    }

    /**
     * Exports root elements and `BoundaryOperation`s with their qualified names.
     */
    protected override exportNode(node: AstNode, exports: AstNodeDescription[], document: ClassifierDocument): void {
        if (isAbstractElement(node) || isBoundaryOperation(node)) {
            const name = this.qualifiedNameProvider.getQualifiedName(node);
            if (name) {
                exports.push(this.descriptions.createDescription(node, name, document));
            }
        }
    }
}
