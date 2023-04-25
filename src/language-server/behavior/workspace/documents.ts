import { LangiumDocument } from "langium";
import { QualifiedName, Workspace, isWorkspace, ValueContainer, Classifier } from "../../generated/ast";


/**
 * A Langium document holds the parse result (AST and CST) and any additional state that is derived
 * from the AST, e.g. the result of scope precomputation.
 */
export interface BehaviorDocument extends LangiumDocument<Workspace> {
    valueContainerToType: ValueContainerToType
}

export function isBehaviorDocument(document: LangiumDocument): document is BehaviorDocument {
    return isWorkspace(document.parseResult.value);
}

/**
 * Specifies the mapping between simple `name` of {@link ValueContainer} and {@link QualifiedName} of {@link Classifier}
 */
export type ValueContainerToType = Map<string, QualifiedName>;
export type ReadOnlyValueContainerToType = ReadonlyMap<string, QualifiedName>;