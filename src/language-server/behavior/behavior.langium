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
    Classifier | BoundaryObject | BoundaryOperation
;

Behavior:
    'behavior' name=ID
    '{'
        (statements+=AbstractStatement)*
    '}'
;

AbstractStatement:
    VariableDeclaration
    |
    VariableAssignment
    |
    ConstantInitialization
    |
    BoundaryObjectInvokation
;

ValueContainer:
    VariableDeclaration
    |
    ConstantInitialization
;

VariableDeclaration infers Variable:
    'var' name=ID
    ':' type=[Classifier:QualifiedName]
    (Assignment)?
;

fragment Assignment:
    '=' ImplicitValue
;

fragment ImplicitValue:
    (value=ValueStatement | valueContainer=[ValueContainer])
;

ValueStatement:
    STRING{infer StringValue} | INT{infer IntValue}
;

VariableAssignment:
    variable=[Variable]
    Assignment
;

ConstantInitialization infers Constant:
    'val' name=ID
    Assignment
;

BoundaryObjectInvokation:
    operation=[BoundaryOperation:QualifiedName]
    '('
    (arguments+=Argument (',' arguments+=Argument)*)?
    ')'
;

Argument:
    ImplicitValue
;