grammar Classifier
import "../../grammar/classifier-feature"
import "../../grammar/crystal-common"

entry Module:
    package=Package
    ('import' imports+=[Classifier:QualifiedName])*
    (classifiers+=(Classifier|TestClassifier))*
;

