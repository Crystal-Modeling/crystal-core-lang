import { ValidationChecks } from "langium";
import { NamedAstNodeValidator } from "../../shared-core/validation/core-validation";
import { CrystalCoreLanguageAstType } from "../../generated/ast";
import { ClassifierServices } from "../classifier-module";

/**
 * Register custom validation checks.
 */
export function registerClassifierValidationChecks(services: ClassifierServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ClassifierValidator;
    const checks: ValidationChecks<CrystalCoreLanguageAstType> = {
        Classifier: validator.checkNameStartsWithCapital,
        BoundaryObject: validator.checkNameStartsWithLowercase,
        BoundaryOperation: validator.checkNameStartsWithLowercase,
        OperationParameter: validator.checkNameStartsWithLowercase
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ClassifierValidator extends NamedAstNodeValidator {

}