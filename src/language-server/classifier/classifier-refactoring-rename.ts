import { AstNode, CstNode, DefaultRenameProvider, GenericAstNode, LangiumDocument, findAssignment, findDeclarationNodeAtOffset, isNamed, isReference } from "langium";
import { Position, Range } from 'vscode-languageserver';

export class ClassifierRenameProvider extends DefaultRenameProvider {

    override renameNodeRange(doc: LangiumDocument, position: Position): Range | undefined {
        const rootNode = doc.parseResult.value.$cstNode;
        const offset = doc.textDocument.offsetAt(position);
        if (rootNode && offset) {
            const leafNode = findDeclarationNodeAtOffset(rootNode, offset, this.grammarConfig.nameRegexp);
            if (!leafNode || leafNode.feature.$type === "Keyword") {
                return undefined;
            }

            if (this.isNameNode(leafNode) || this.isResolvableReference(leafNode)) {
                return leafNode.range;
            }
            if (!leafNode.parent) {
                return undefined;
            }
            if (this.isNameNode(leafNode.parent)) {
                return leafNode.parent.range;
            }
            // HACK: Relying on the fact, that ReferencedElement name corresponds to the last token
            // If it is QualifiedName cross-reference, rename only last ID CSTNode (= rename element in the package)
            // Package itself cannot be renamed from the QualifiedName reference
            if (this.isResolvableReference(leafNode.parent)) {
                return leafNode.parent.children[leafNode.parent.children.length - 1].range;
            }
        }
        return undefined;
    }

    override isNameNode(leafNode: CstNode | undefined): boolean | undefined {
        return leafNode?.element && isNamed(leafNode.element) && leafNode === this.nameProvider.getNameNode(leafNode.element);
    }

    protected isResolvableReference(sourceCstNode: CstNode): boolean {
        return sourceCstNode.feature.$type === "CrossReference"
            && !!this.findDeclaration(sourceCstNode);
    }

    //TODO: Consider creating another ticket at Langium: need to correct DefaultRenameProvider
    // Copied from packages/langium/src/references/references.ts@findDeclaration, **correcting** it
    protected findDeclaration(sourceCstNode: CstNode): AstNode | undefined {
        const assignment = findAssignment(sourceCstNode);
        const nodeElem = sourceCstNode.element;
        if (assignment && nodeElem) {
            const reference = (nodeElem as GenericAstNode)[assignment.feature];

            if (isReference(reference)) {
                return reference.ref;
            } else if (Array.isArray(reference)) {
                for (const ref of reference) {
                    if (isReference(ref) && ref.$refNode
                        && ref.$refNode.offset <= sourceCstNode.offset
                        && ref.$refNode.end >= sourceCstNode.end) {
                        return ref.ref;
                    }
                }
            }
        }
        return undefined;
    }
}