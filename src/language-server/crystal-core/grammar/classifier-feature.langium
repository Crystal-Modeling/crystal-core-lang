import "./crystal-common"


Classifier:
    'type' name=ID
;

interface ExplicitValue {
    type?: @Classifier
}

interface StringValue extends ExplicitValue {
    value: string
}

interface IntValue extends ExplicitValue {
    value: number
}