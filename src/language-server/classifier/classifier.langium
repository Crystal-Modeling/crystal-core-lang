grammar Classifier
import "../crystal-terminals"

entry Model:
    (classifiers+=Classifier)*;

Classifier:
    'type' name=ID
;
