import {
    LangiumServices, Module, PartialLangiumServices
} from 'langium';
import { BoundaryObjectValidator } from './boundary-object-validator';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type BoundaryObjectAddedServices = {
    validation: {
        BoundaryObjectValidator: BoundaryObjectValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type BoundaryObjectServices = LangiumServices & BoundaryObjectAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const BoundaryObjectModule: Module<BoundaryObjectServices, PartialLangiumServices & BoundaryObjectAddedServices> = {
    validation: {
        BoundaryObjectValidator: () => new BoundaryObjectValidator()
    }
};
