import {
    Module
} from 'langium';
import { CrystalCoreServices, PartialCrystalCoreServices } from '../shared-core/crystal-core-services';
import { CrystalCoreNameProvider, QualifiedNameProvider } from '../shared-core/references/core-naming';
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
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type BehaviorServices = CrystalCoreServices & BehaviorAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const BehaviorModule: Module<BehaviorServices, PartialCrystalCoreServices & BehaviorAddedServices> = {
    references: {
        NameProvider: () => new CrystalCoreNameProvider(),
        QualifiedNameProvider: (services) => new QualifiedNameProvider(services),
        ScopeProvider: (services) => new BehaviorScopeProvider(services),
    },
    validation: {
        BehaviorTypesCollector: (services) => new BehaviorTypesCollector(services),
        BehaviorValidator: (services) => new BehaviorValidator(services),
    },
    lsp: {
        SemanticTokenProvider: (services) => new BehaviorSemanticTokenProvider(services),
    }
};
