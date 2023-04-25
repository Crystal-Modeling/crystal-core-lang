import { ValidationAcceptor, ValidationChecks, findRootNode, stream } from 'langium';
import { Constant, CrystalCoreLanguageAstType, ValueContainerAssignmentStatement, Variable, Workspace, isConstant, isValueContainer, isValueContainerAssignmentStatement } from '../../generated/ast';
import { NameableNodeValidator } from '../../shared-core/validation/core-validation';
import type { BehaviorServices } from '../behavior-module';
import { isBehaviorDocument } from '../workspace/documents';
import { getValueTypeName } from './types-computation';

/**
 * Register custom validation checks.
 */
export function registerBehaviorValidationChecks(services: BehaviorServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.BehaviorValidator;
    const checks: ValidationChecks<CrystalCoreLanguageAstType> = {
        BoundaryObject: validator.checkNameStartsWithCapital,
        BoundaryOperation: validator.checkNameStartsWithLowercase,
        OperationParameter: validator.checkNameStartsWithLowercase,
        ValueContainer: [
            validator.checkNameStartsWithLowercase,
        ],
        Constant: [
            validator.checkConstantIsInitialized,
        ],
        Variable: [
            validator.checkVariableTypeIsDefined,
        ],
        ValueContainerAssignmentStatement: validator.checkConstantIsNotReInitialized,
        Workspace: [
            validator.checkValueContainerTypesMatchAssignedValueTypes,
            validator.checkValueContainerTypesMatchAssignedValueTypesInAssignments,
            validator.checkInvokationArgumentsMatchOperationParameters,
        ]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
//TODO: Optimize implementation
export class BehaviorValidator extends NameableNodeValidator {

    checkVariableTypeIsDefined(variable: Variable, accept: ValidationAcceptor): void {
        const document = findRootNode(variable).$document
        if (document && isBehaviorDocument(document)) {
            if (!document.valueContainerToType.has(variable.name)) {
                accept('error', `Type of ${variable.$type} must be defined or the value assigned`, { node: variable })
            }
        }
    }

    checkConstantIsInitialized(constant: Constant, accept: ValidationAcceptor): void {
        if (!constant.value) {
            accept('error', `${constant.$type} must be initialized immediately.`, { node: constant, property: 'value' })
        }
    }

    checkConstantIsNotReInitialized(valueContainerAssignment: ValueContainerAssignmentStatement, accept: ValidationAcceptor): void {
        if (isConstant(valueContainerAssignment.variable.ref))
            accept('error', `Constant cannot be reassigned. [${valueContainerAssignment.variable.ref.name}]`, { node: valueContainerAssignment })
    }

    checkValueContainerTypesMatchAssignedValueTypes(workspace: Workspace, accept: ValidationAcceptor): void {
        if (workspace.$document && isBehaviorDocument(workspace.$document)) {
            const typeNameByValueContainerName = workspace.$document.valueContainerToType
            stream(workspace.behavior.statements)
                .filter(isValueContainer)
                .filter((valueContainer) => valueContainer.value)
                .forEach((valueContainer) => {
                    console.debug("=======> Checking ValueContainer type against its Value type")
                    const valueContainerTypeName = typeNameByValueContainerName.get(valueContainer.name)
                    const valueTypeName = getValueTypeName(valueContainer.value!, typeNameByValueContainerName)
                    if (valueContainerTypeName !== valueTypeName) {
                        accept('error',
                            `Value of type ${valueTypeName} is not compatible with ${valueContainer.$type} of type ${valueContainerTypeName}.`,
                            { node: valueContainer, property: 'value' })
                    }
                });

        }
    }

    checkValueContainerTypesMatchAssignedValueTypesInAssignments(workspace: Workspace, accept: ValidationAcceptor): void {
        if (workspace.$document && isBehaviorDocument(workspace.$document)) {
            const typeNameByValueContainerName = workspace.$document.valueContainerToType
            stream(workspace.behavior.statements)
                .filter(isValueContainerAssignmentStatement)
                .filter((assignment) => assignment.variable.ref)
                .forEach((assignment) => {
                    const valueContainer = assignment.variable.ref!
                    console.debug("=======> Checking ValueContainer type against assigned Value type")
                    const valueContainerTypeName = typeNameByValueContainerName.get(valueContainer.name)
                    const valueTypeName = getValueTypeName(assignment.value, typeNameByValueContainerName)
                    if (valueContainerTypeName !== valueTypeName) {
                        accept('error',
                            `Value of type ${valueTypeName} is not compatible with ${valueContainer.$type} of type ${valueContainerTypeName}.`,
                            { node: assignment, property: 'value' })
                    }
                });

        }
    }

    // checkAssignmentValueMatchesValueContainerByType(assignment: ValueContainerAssignmentStatement, accept: ValidationAcceptor): void {
    //     if (assignment.variable.ref) {
    //         const document = findRootNode(assignment).$document
    //         if (document && isBehaviorDocument(document)) {
    //             const valueContainer = assignment.variable.ref
    //             const typeNameByValueContainerName = document.valueContainerToType
    //             console.debug("=======> Checking ValueContainer type against assigned Value type")
    //             const valueContainerTypeName = typeNameByValueContainerName.get(valueContainer.name)
    //             const valueTypeName = getValueTypeName(assignment.value, typeNameByValueContainerName)
    //             if (valueContainerTypeName !== valueTypeName) {
    //                 accept('error',
    //                     `Value of type ${valueTypeName} is not compatible with ${valueContainer.$type} of type ${valueContainerTypeName}.`,
    //                     { node: valueContainer, property: 'value' })
    //             }
    //         }
    //     }
    // }

    checkInvokationArgumentsMatchOperationParameters(workspace: Workspace, accept: ValidationAcceptor): void {
        if (workspace.$document && isBehaviorDocument(workspace.$document)) {
            const operationsParametersValidationInfo = workspace.$document.operationsParametersValidationInfo
            operationsParametersValidationInfo.forEach(({ invokation, definition }) => {
                if (invokation.argumentTypes.length !== definition.parameters.length) {
                    const index = invokation.argumentTypes.length < definition.parameters.length
                        ? invokation.argumentTypes.length - 1
                        : definition.parameters.length
                    accept('error',
                        `Expected ${definition.parameters.length} arguments, but got ${invokation.argumentTypes.length}`,
                        { node: invokation.node, property: 'arguments', index })
                } else {
                    const argNumber = definition.parameters.length
                    for (let i = 0; i < argNumber; i++) {
                        if (invokation.argumentTypes[i] !== definition.parameters[i].type) {
                            const actualArgumentType = invokation.argumentTypes[i]
                            const expectedArgumentType = definition.parameters[i].type
                            const parameterName = definition.parameters[i].name
                            accept('error',
                                `Expected ${expectedArgumentType} for ${nth(i + 1)} argument (${parameterName}), but got ${actualArgumentType})`,
                                { node: invokation.node, property: 'arguments', index: i })
                        }
                    }
                }
            })
        }
    }
}


function nth(n: number): string {
    if (n === 1) return '1st'
    if (n === 2) return '2nd'
    if (n === 3) return '3rd'
    return `${n}th`
}