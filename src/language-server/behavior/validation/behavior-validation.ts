import { ValidationChecks } from 'langium';
import { NameableNodeValidator } from '../../shared-core/validation/core-validation';
import { CrystalCoreLanguageAstType } from '../../generated/ast';
import type { BehaviorServices } from '../behavior-module';

/**
 * Register custom validation checks.
 */
export function registerBehaviorValidationChecks(services: BehaviorServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.BehaviorValidator;
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
export class BehaviorValidator extends NameableNodeValidator {

}
