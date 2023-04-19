grammar BoundaryObject
import "../../grammar/boundary-object-feature"
import "../../grammar/crystal-common"

entry Library:
    package=Package
    (boundaryObjects+=BoundaryObject)*;
