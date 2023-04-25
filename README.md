# Crystal Core Language

## Aim

To implement minimal requirements for designing CrystalCore grammar and Langium LS during MSc in Huddersfield.

## Current requirements (satisfied)

CrystalCore v1 should have:

1. Tiny *Classifier* lang with typedefs of basic lang types (such as String and Integer), and library *BoundaryObject*s, such as Console. ∀ BoundaryObject should have just text name (so far). Icons should be added on visualizing phase (e.g., as SVG icon URLs, if CrystalCore lib = github repo, following GoLang idea).
2. Main *Behavior* lang for defining Operation's behavior:
     * Behavior declaration (Operation's implementation)
     * Variable declaration
     * Variable assignment
     * Constant initialization
     * Value specification (i.e., value *literal*)
     * Import definition
     * BoundaryOperation invokation

Semantic elements to be included:

* BoundaryOperation (an Operation with no behavior)
* BoundaryObject (a collection of BoundaryOperations)
* Classifier -- currently supports only basic library types, like String or Integer. Full Classifiers support to be included with ***CrystalCore Classifier*** feature. The difference between BoundaryObject and Classifier is that the latter can be instantiated. An instance of a library classifier is comparable with BoundaryObject.
