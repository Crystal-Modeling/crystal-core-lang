import "./core-common"
import "./classifier-feature"


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