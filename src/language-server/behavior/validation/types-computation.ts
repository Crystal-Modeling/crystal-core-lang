import { Reference } from "langium";
import * as ast from "../../generated/ast";
import { CrystalCoreNameProvider, QualifiedNameProvider } from "../../shared-core/references/core-naming";
import { BehaviorServices } from "../behavior-module";
import { BehaviorDocument, OperationsParametersValidationInfo, ParameterDefinition, ReadOnlyValueContainerToType, ValueContainerToType } from "../workspace/documents";

export class BehaviorTypesCollector {

    private qualifiedNameProvider: QualifiedNameProvider
    private nameProvider: CrystalCoreNameProvider

    constructor(services: BehaviorServices) {
        this.qualifiedNameProvider = services.references.QualifiedNameProvider
        this.nameProvider = services.references.NameProvider
    }

    public collectTypesForValueContainers(workspace: ast.Workspace): ValueContainerToType {
        const types: ValueContainerToType = new Map()

        for (const statement of workspace.behavior.statements) {
            if (ast.isValueContainer(statement)) {
                const valueContainer = statement
                const typeName = this.computeTypeNameForValueContainer(types, valueContainer)
                const valueContainerName = this.nameProvider.getName(valueContainer)

                if (typeName)
                    //HACK: Here, and in many other places I rely on the fact that fully-qualified name of the element is unique across all workspace documents. This needs to be addressed in language validator
                    types.set(valueContainerName, typeName)

            }
        }

        return types
    }

    public collectOperationsParametersValidationInfo(workspace: ast.Workspace): OperationsParametersValidationInfo {

        const operationsParametersValidation: OperationsParametersValidationInfo = []
        console.debug("===> collectTypesForValueContainers")

        for (const statement of workspace.behavior.statements) {
            console.debug("==> Statement of type: ", statement.$type)
            if (ast.isBoundaryOperationInvokation(statement)) {
                const operationInvokation = statement
                console.debug("===> Collecting validation info for invokation of ", operationInvokation.$cstNode?.text)
                if (operationInvokation.operation.ref) {
                    operationsParametersValidation.push({
                        invokation: {
                            node: operationInvokation,
                            argumentTypes: operationInvokation.arguments
                                .map((arg) => getValueTypeName(arg.value,
                                    //HACK: Relying on the fact that `document.valueContainerToType` is already filled
                                    (workspace.$document as BehaviorDocument).valueContainerToType))
                                .filter((item): item is string => !!item)
                        },
                        definition: {
                            node: operationInvokation.operation.ref,
                            parameters: operationInvokation.operation.ref.parameters
                                .map((param) => ({
                                    name: this.nameProvider.getName(param),
                                    type: this.getClassifierTypeName(param.type)
                                }))
                                .filter((param): param is ParameterDefinition => !!param.type)
                        }
                    })
                }

            }
        }

        return operationsParametersValidation
    }

    private computeTypeNameForValueContainer(types: ReadOnlyValueContainerToType, valueContainer: ast.ValueContainer)
        : ast.QualifiedName | undefined {
        let typeName: ast.QualifiedName | undefined;
        if (valueContainer.type) {
            typeName = this.getClassifierTypeName(valueContainer.type)
        } else if (valueContainer.value) {
            typeName = getValueTypeName(valueContainer.value, types)
        }
        return typeName;
    }

    private getClassifierTypeName(type: Reference<ast.Classifier>)
        : ast.QualifiedName | undefined {
        if (type.ref) {
            return this.qualifiedNameProvider.getQualifiedName(type.ref)
        }
        return undefined;
    }

}

export function getValueTypeName(value: ast.ExplicitValue | ast.ImplicitValue, types: ReadOnlyValueContainerToType)
    : ast.QualifiedName | undefined {
    let typeName: ast.QualifiedName | undefined
    if (ast.isExplicitValue(value)) {

        //TODO: Hardcoding lang library elements in the Langium server must be avoided. Should be moved into grammar definition when embedded libraries are introduced
        if (ast.isStringValue(value)) {
            typeName = "crystal.lang.String";
        } else if (ast.isIntValue(value)) {
            typeName = "crystal.lang.Integer";
        } else {
            typeName = "crystal.lang.Invalid";
        }

    } else {
        if (value.origin.ref) {
            const valueOriginName = value.origin.ref.name;
            typeName = types.get(valueOriginName);
        }
    }
    return typeName;
}
