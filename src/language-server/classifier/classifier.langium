grammar Classifier
import "../crystal-core/grammar/boundary-object-feature"
import "../crystal-core/grammar/classifier-feature"
import "../crystal-core/grammar/crystal-common"

entry Module:
    package=Package
    ('import' imports+=[Classifier:QualifiedName])*
    (elements+=AbstractElement)*
;

AbstractElement:
    Classifier | BoundaryObject
;

