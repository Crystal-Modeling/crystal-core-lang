grammar BoundaryObject
import "./crystal-terminals"

entry Model:
    (persons+=Person)*;

Person:
    'person' name=STRING
;
