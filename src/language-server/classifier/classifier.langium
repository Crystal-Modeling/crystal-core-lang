grammar Classifier
import "../../grammar/boundary-object-feature"
import "../../grammar/classifier-feature"
import "../../grammar/crystal-common"

entry Module:
    package=Package
    ('import' imports+=[Classifier:QualifiedName])*
    (elements+=AbstractElement)*
;

AbstractElement:
    Classifier | BoundaryObject
;

