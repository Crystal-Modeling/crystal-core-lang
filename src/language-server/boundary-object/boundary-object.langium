grammar BoundaryObject
import "../../grammar/classifier-feature"
import "../../grammar/crystal-common"

entry Library:
    Packageable
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
    (':' returnType=[Classifier:ID])?
;

OperationParameter:
    name=ID
    ':' type=[Classifier:ID]
;