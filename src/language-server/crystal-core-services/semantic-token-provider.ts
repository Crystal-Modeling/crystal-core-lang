import { AbstractSemanticTokenProvider, AstNode, SemanticTokenAcceptor } from "langium";
import { SemanticTokenTypes } from "vscode-languageserver-types";
import { isBoundaryObject, isBoundaryOperation, isClassifier, isOperationParameter } from "../generated/ast";

export abstract class AbstractCrystalCoreSemanticTokenProvider extends AbstractSemanticTokenProvider {

    protected highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void {
        if (isClassifier(node)) {
            acceptor({
                node,
                property: "name",
                type: SemanticTokenTypes.class
            });
        } else if (isBoundaryObject(node)) {
            acceptor({
                node,
                property: "name",
                type: SemanticTokenTypes.variable
            });
        } else if (isBoundaryOperation(node)) {
            acceptor({
                node,
                property: "name",
                type: SemanticTokenTypes.method
            });
            acceptor({
                node,
                property: "returnType",
                type: SemanticTokenTypes.class
            });
        } else if (isOperationParameter(node)) {
            acceptor({
                node,
                property: "type",
                type: SemanticTokenTypes.class
            });
            acceptor({
                node,
                property: "name",
                type: SemanticTokenTypes.parameter
            });
        }
    }

}