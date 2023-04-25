import { Reference } from "langium";
import * as ast from "../../generated/ast";
import { QualifiedNameProvider } from "../../shared-core/references/core-naming";
import { BehaviorServices } from "../behavior-module";
import { ReadOnlyValueContainerToType, ValueContainerToType } from "../workspace/documents";

export class BehaviorTypesCollector {

    private qualifiedNameProvider: QualifiedNameProvider

    constructor(services: BehaviorServices) {
        this.qualifiedNameProvider = services.references.QualifiedNameProvider
    }

    public collectTypesForValueContainers(workspace: ast.Workspace): ValueContainerToType {
        const types: ValueContainerToType = new Map()
        console.debug("===> collectTypesForValueContainers")

        for (const statement of workspace.behavior.statements) {
            console.debug("==> Statement of type: ", statement.$type)
            if (ast.isValueContainer(statement)) {
                const valueContainer = statement
                console.debug("===> Collecting type for ValueContainer ", valueContainer.name)
                const typeName = this.computeTypeNameForValueContainer(types, valueContainer);
                console.debug("typeName is", typeName)

                if (typeName)
                    //HACK: Here, and in many other places I rely on the fact that fully-qualified name of the element is unique across all workspace documents. This needs to be addressed in language validator
                    types.set(valueContainer.name, typeName);

            }
        }

        return types
    }

    private computeTypeNameForValueContainer(types: ReadOnlyValueContainerToType, valueContainer: ast.ValueContainer)
        : ast.QualifiedName | undefined {
        let typeName: ast.QualifiedName | undefined;
        if (valueContainer.type) {
            typeName = this.getClassifierTypeName(valueContainer.type)
        } else if (valueContainer.value) {
            typeName = getValueTypeName(valueContainer.value, types);
        }
        return typeName;
    }

    private getClassifierTypeName(type: Reference<ast.Classifier>)
        : ast.QualifiedName | undefined {
        if (type.ref) {
            return this.qualifiedNameProvider.getQualifiedName(type.ref);
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
