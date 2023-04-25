import {
    LangiumServices, Module, PartialLangiumServices
} from 'langium';
import { CrystalCoreAddedServices } from '../shared-core/crystal-core-services';
import { QualifiedNameProvider } from '../shared-core/references/core-naming';
import { BehaviorSemanticTokenProvider } from './lsp/behavior-semantic-tokens';
import { BehaviorScopeProvider } from './references/behavior-scope';
import { BehaviorValidator } from './validation/behavior-validation';
import { BehaviorTypesCollector } from './validation/types-computation';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type BehaviorAddedServices = {
    validation: {
        BehaviorTypesCollector: BehaviorTypesCollector
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
        QualifiedNameProvider: (services) => new QualifiedNameProvider(services),
        ScopeProvider: (services) => new BehaviorScopeProvider(services)
    },
    validation: {
        BehaviorTypesCollector: (services) => new BehaviorTypesCollector(services),
        BehaviorValidator: () => new BehaviorValidator()
    },
    lsp: {
        SemanticTokenProvider: (services) => new BehaviorSemanticTokenProvider(services)
    }
};
