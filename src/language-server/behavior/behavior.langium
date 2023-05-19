grammar Behavior
import "../shared-core/grammar/boundary-object-feature"
import "../shared-core/grammar/classifier-feature"
import "../shared-core/grammar/core-common"

entry Workspace:
    package=Package
    ('import' imports+=[ImportableElement:QualifiedName])*
    behavior=Behavior
;

type ImportableElement = Classifier | BoundaryObject;

Behavior:
    'behavior' name=ID
    '{'
        (statements+=AbstractStatement)*
    '}'
;

AbstractStatement:
    ValueContainerDeclarationStatement
    |
    ValueContainerAssignmentStatement
    |
    BoundaryOperationInvokationStatement
;

ValueContainerDeclarationStatement returns ValueContainer:
    (mutable?='var'{Variable} | 'val'{Constant})
    name=ID
    (':' type=[Classifier:QualifiedName])?
    ValueAssignment?
;

fragment ValueAssignment:
    '=' ValueDeclaration
;

fragment ValueDeclaration:
    (value=(ValueLiteral | ValueReference))
;

ValueLiteral returns ExplicitValue:
    {StringValue}value=STRING | {IntValue}value=INT
;

ValueReference returns ImplicitValue:
    origin=[ValueContainer:ID]
;

ValueContainerAssignmentStatement:
    variable=[ValueContainer:ID]
    ValueAssignment
;

BoundaryOperationInvokationStatement returns BoundaryOperationInvokation:
    operation=[BoundaryOperation:QualifiedName]
    '('
    (arguments+=Argument (',' arguments+=Argument)*)?
    ')'
;

Argument:
    ValueDeclaration
;

interface ValueContainer {
    name: string
    mutable: boolean
    type?: @Classifier
    value?: ExplicitValue | ImplicitValue
}

interface ImplicitValue {
    origin: @ValueContainer
}

interface Variable extends ValueContainer {
}

interface Constant extends ValueContainer {
}

interface BoundaryOperationInvokation {
    operation: @BoundaryOperation
    arguments: Argument[]
}