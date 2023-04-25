import { LangiumDocument } from "langium";
import { QualifiedName, Workspace, isWorkspace, ValueContainer, Classifier, BoundaryOperationInvokation, BoundaryOperation } from "../../generated/ast";


/**
 * A Langium document holds the parse result (AST and CST) and any additional state that is derived
 * from the AST, e.g. the result of scope precomputation.
 */
export interface BehaviorDocument extends LangiumDocument<Workspace> {
    valueContainerToType: ValueContainerToType
    operationsParametersValidationInfo: OperationsParametersValidationInfo
}

export function isBehaviorDocument(document: LangiumDocument): document is BehaviorDocument {
    return isWorkspace(document.parseResult.value);
}

/**
 * Specifies the mapping between simple `name` of {@link ValueContainer} and {@link QualifiedName} of {@link Classifier}
 */
export type ValueContainerToType = Map<string, QualifiedName>;
export type ReadOnlyValueContainerToType = ReadonlyMap<string, QualifiedName>;

export type OperationsParametersValidationInfo = Array<OperationParametersValidationInfo>

export interface OperationParametersValidationInfo {
    invokation: {
        node: BoundaryOperationInvokation
        argumentTypes: QualifiedName[]
    }
    definition: {
        node: BoundaryOperation
        parameters: ParameterDefinition[]
    }
}

export interface ParameterDefinition { name: string, type: QualifiedName }