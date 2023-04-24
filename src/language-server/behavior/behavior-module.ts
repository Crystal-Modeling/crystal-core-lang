import {
    LangiumServices, Module, PartialLangiumServices
} from 'langium';
import { QualifiedNameProvider } from '../shared-core/references/core-naming';
import { CrystalCoreAddedServices } from '../shared-core/crystal-core-services';
import { BehaviorScopeProvider } from './references/behavior-scope';
import { BehaviorSemanticTokenProvider } from './lsp/behavior-semantic-tokens';
import { BehaviorValidator } from './validation/behavior-validation';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type BehaviorAddedServices = {
    validation: {
        BehaviorValidator: BehaviorValidator
    }
} & CrystalCoreAddedServices

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type BehaviorServices = LangiumServices & BehaviorAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const BehaviorModule: Module<BehaviorServices, PartialLangiumServices & BehaviorAddedServices> = {
    references: {
        QualifiedNameProvider: () => new QualifiedNameProvider(),
        ScopeProvider: (services) => new BehaviorScopeProvider(services)
    },
    validation: {
        BehaviorValidator: () => new BehaviorValidator()
    },
    lsp: {
        SemanticTokenProvider: (services) => new BehaviorSemanticTokenProvider(services)
    }
};
