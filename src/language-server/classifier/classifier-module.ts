import { LangiumServices, Module, PartialLangiumServices } from "langium";
import { QualifiedNameProvider } from "../shared-core/references/core-naming";
import { ClassifierRenameProvider } from "./lsp/classifier-rename-provider";
import { ClassifierScopeComputation, ClassifierScopeProvider } from "./references/classifier-scope";
import { ClassifierSemanticTokenProvider } from "./lsp/classifier-semantic-tokens";
import { ClassifierValidator } from "./validation/classifier-validation";

/**
 * Declaration of custom services - add your own service classes here.
 */
export type ClassifierAddedServices = {
    references: {
        QualifiedNameProvider: QualifiedNameProvider
    },
    validation: {
        ClassifierValidator: ClassifierValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type ClassifierServices = LangiumServices & ClassifierAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const ClassifierModule: Module<ClassifierServices, PartialLangiumServices & ClassifierAddedServices> = {
    references: {
        QualifiedNameProvider: (services) => new QualifiedNameProvider(services),
        ScopeComputation: (services) => new ClassifierScopeComputation(services),
        ScopeProvider: (services) => new ClassifierScopeProvider(services)
    },
    validation: {
        ClassifierValidator: () => new ClassifierValidator()
    },
    lsp: {
        SemanticTokenProvider: (services) => new ClassifierSemanticTokenProvider(services),
        RenameProvider: (services) => new ClassifierRenameProvider(services)
    }
};
