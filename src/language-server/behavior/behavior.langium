grammar Behavior
import "../../grammar/boundary-object-feature"
import "../../grammar/classifier-feature"
import "../../grammar/crystal-common"

entry Workspace:
    package=Package
    ('import' imports+=[ImportableElement:QualifiedName])*
    behavior=Behavior
;

//BUG: Raise a ticket on Langium: ImportableElement *is* referenced in CrossReference
ImportableElement:
    Classifier | BoundaryObject
;

Behavior:
    'behavior' name=ID
    '{'
        (statements+=AbstractStatement)*
    '}'
;

AbstractStatement:
    ValueContainerDeclarationStatement
    |
    VariableAssignmentStatement
    |
    BoundaryOperationInvokationStatement
;

ValueContainerDeclarationStatement returns ValueContainer:
    (mutable?='var' | 'val')
    name=ID
    ((   
        ':' type=[Classifier:QualifiedName]
        ValueAssignment?
    )
    |
    ValueAssignment
    )
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
    valueContainer=[ValueContainer:ID]
;

VariableAssignmentStatement:
    variable=[ValueContainer:ID]
    ValueAssignment
;

BoundaryOperationInvokationStatement:
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
    valueContainer: @ValueContainer
}