grammar BoundaryObject
import "../../grammar/classifier-feature"
import "../../grammar/crystal-common"

entry Library:
    package=Package
    (boundaryObjects+=BoundaryObject)*;

BoundaryObject:
    'boundary' name=ID '{'
    (operations+=BoundaryOperation)*
    '}'
;

BoundaryOperation:
    'op' name=ID
    '('
    (parameters+=OperationParameter (',' parameters+=OperationParameter)*)?
    ')'
    (':' returnType=[Classifier:QualifiedName])?
;

OperationParameter:
    name=ID
    ':' type=[Classifier:QualifiedName]
;