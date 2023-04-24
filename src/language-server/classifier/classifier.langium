grammar Classifier
import "../shared-core/grammar/boundary-object-feature"
import "../shared-core/grammar/classifier-feature"
import "../shared-core/grammar/core-common"

entry Module:
    package=Package
    ('import' imports+=[Classifier:QualifiedName])*
    (elements+=AbstractElement)*
;

AbstractElement:
    Classifier | BoundaryObject
;

