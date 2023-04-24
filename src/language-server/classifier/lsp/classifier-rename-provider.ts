import { AstNode, CstNode, DefaultRenameProvider, LangiumDocument, LangiumDocuments, ReferenceDescription, findDeclarationNodeAtOffset } from "langium";
import { Location, Position, Range, RenameParams, TextEdit, WorkspaceEdit } from 'vscode-languageserver';
import { URI } from "vscode-uri";
import { QualifiedNameProvider } from "../../shared-core/references/core-naming";
import { isModule } from "../../generated/ast";
import { ClassifierServices } from "../classifier-module";

export class ClassifierRenameProvider extends DefaultRenameProvider {

    protected readonly langiumDocuments: LangiumDocuments;
    protected readonly qualifiedNameProvider: QualifiedNameProvider;

    constructor(services: ClassifierServices) {
        super(services);
        this.langiumDocuments = services.shared.workspace.LangiumDocuments;
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
    }

    override renameNodeRange(doc: LangiumDocument, position: Position): Range | undefined {
        const rootNode = doc.parseResult.value.$cstNode;
        const offset = doc.textDocument.offsetAt(position);
        if (rootNode && offset) {
            const leafNode = findDeclarationNodeAtOffset(rootNode, offset, this.grammarConfig.nameRegexp);
            if (!leafNode || leafNode.feature.$type === "Keyword") {
                return undefined;
            }

            if (this.isNameNode(leafNode) || this.isResolvableCrossReference(leafNode)) {
                return leafNode.range;
            }
            if (leafNode.parent) {
                if (this.isNameNode(leafNode.parent)) {
                    return leafNode.parent.range;
                }
                // HACK: Relying on the fact, that ReferencedElement name corresponds to the last token
                // If it is QualifiedName cross-reference, rename only last ID CSTNode (= rename element in the package)
                // Package itself cannot be renamed from the QualifiedName reference
                if (this.isResolvableCrossReference(leafNode.parent)) {
                    return leafNode.parent.children[leafNode.parent.children.length - 1].range;
                }
            }
        }
        return undefined;
    }

    override async rename(document: LangiumDocument, params: RenameParams): Promise<WorkspaceEdit | undefined> {
        const changes: Record<string, TextEdit[]> = {};
        const rootNode = document.parseResult.value.$cstNode;
        if (!rootNode) return undefined;
        const offset = document.textDocument.offsetAt(params.position);
        const leafNode = findDeclarationNodeAtOffset(rootNode, offset, this.grammarConfig.nameRegexp);
        if (!leafNode) return undefined;
        const targetNode = this.references.findDeclaration(leafNode);
        if (!targetNode) return undefined;
        const newQualifiedName = this.buildQualifiedName(targetNode, params.newName);
        const options = { onlyLocal: false, includeDeclaration: true };
        const references = this.references.findReferences(targetNode, options);
        references.forEach(reference => {
            const nodeLocation = this.getRefLocation(reference);
            const newName = this.hasQualifiedNameText(reference.sourceUri, reference.segment.range)
                ? newQualifiedName
                : params.newName;
            const nodeChange = TextEdit.replace(nodeLocation.range, newName);
            const uri = reference.sourceUri.toString();
            if (changes[uri]) {
                changes[uri].push(nodeChange);
            } else {
                changes[uri] = [nodeChange];
            }
        });

        return { changes };
    }

    protected isResolvableCrossReference(sourceCstNode: CstNode): boolean {
        return sourceCstNode.feature.$type === "CrossReference"
            && !!this.references.findDeclaration(sourceCstNode);
    }

    protected hasQualifiedNameText(uri: URI, range: Range) {
        const langiumDoc = this.langiumDocuments.getOrCreateDocument(uri);
        const rangeText = langiumDoc.textDocument.getText(range);
        return this.qualifiedNameProvider.isQualifiedName(rangeText);
    }

    protected getRefLocation(ref: ReferenceDescription): Location {
        return Location.create(
            ref.sourceUri.toString(),
            ref.segment.range
        );
    }

    protected buildQualifiedName(node: AstNode, nodeName: string): string {
        if (isModule(node.$container)) {
            return this.qualifiedNameProvider.getQualifiedName(node.$container, nodeName);
        }
        return nodeName;
    }

}