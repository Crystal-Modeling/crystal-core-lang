import { ValidationChecks } from 'langium';
import { NameableNodeValidator } from '../crystal-core-abstract-services';
import { CrystalCoreLanguageAstType } from '../generated/ast';
import type { BoundaryObjectServices } from './boundary-object-module';

/**
 * Register custom validation checks.
 */
export function registerBoundaryObjectValidationChecks(services: BoundaryObjectServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.BoundaryObjectValidator;
    const checks: ValidationChecks<CrystalCoreLanguageAstType> = {
        BoundaryObject: validator.checkNameStartsWithCapital,
        BoundaryOperation: validator.checkNameStartsWithLowercase,
        OperationParameter: validator.checkNameStartsWithLowercase
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class BoundaryObjectValidator extends NameableNodeValidator {

}
