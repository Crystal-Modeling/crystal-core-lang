grammar BoundaryObject
import "../crystal-terminals"

entry Model:
    (boundaryObjects+=BoundaryObject)*;

BoundaryObject:
    'boundary' name=ID '{'
    (operations+=BoundaryOperation)*
    '}';

BoundaryOperation:
    'op' name=ID
    '('
    (parameters+=OperationParameter (',' parameters+=OperationParameter)*)?
    ')'
    (':' returnType=Type)?
;

OperationParameter:
    name=ID
    ':' type=Type
;