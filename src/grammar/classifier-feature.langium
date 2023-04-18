import "./crystal-common"


Classifier:
    'type' name=ID
;

TestClassifier:
    'test' name=ID
    ':' super=[Classifier:QualifiedName]
;