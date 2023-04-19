import { AstNode, Reference } from "langium";


export interface ImportsContainer extends AstNode {
    imports: Reference<AstNode>[]
}

export function isImportsContainer(node: AstNode): node is ImportsContainer {
    return (node as ImportsContainer).imports instanceof Array<Reference<AstNode>>;
}