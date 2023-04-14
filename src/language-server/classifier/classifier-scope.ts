import { AstNodeDescription, DefaultScopeComputation, LangiumDocument, interruptAndCheck, streamAllContents } from "langium";
import { QualifiedNameProvider } from "../crystal-core/naming";
import { ClassifierServices } from "./classifier-module";
import { CancellationToken } from 'vscode-jsonrpc';
import { isClassifier } from "../generated/ast";

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
            if (isClassifier(node)) {
                let name = this.nameProvider.getName(node);
                if (name) {
                    name = this.qualifiedNameProvider.getQualifiedName(node.$container, name);
                    descr.push(this.descriptions.createDescription(node, name, document));
                }
            }
        }
        return descr;
    }

    // override async computeLocalScopes(document: LangiumDocument, cancelToken = CancellationToken.None): Promise<PrecomputedScopes> {
    //     const model = document.parseResult.value as Module;
    //     const scopes = new MultiMap<AstNode, AstNodeDescription>();
    //     await this.processContainer(model, scopes, document, cancelToken);
    //     return scopes;
    // }

    // protected async processContainer(container: Module, scopes: PrecomputedScopes, document: LangiumDocument, cancelToken: CancellationToken): Promise<AstNodeDescription[]> {
    //     const localDescriptions: AstNodeDescription[] = [];
    //     for (const element of container.classifiers) {
    //         await interruptAndCheck(cancelToken);
    //         if (isClassifier(element)) {
    //             const qualifiedName = this.qualifiedNameProvider.getQualifiedName(container, element.name);
    //             const description = this.descriptions.createDescription(element, qualifiedName, document);
    //             localDescriptions.push(description);
    //         }
    //     }
    //     scopes.addAll(container, localDescriptions);
    //     return localDescriptions;
    // }

}
