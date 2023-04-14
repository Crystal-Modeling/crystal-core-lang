import { ValidationChecks } from "langium";
import { NameableNodeValidator } from "../crystal-core/node-validation";
import { CrystalCoreLanguageAstType } from "../generated/ast";
import { ClassifierServices } from "./classifier-module";

/**
 * Register custom validation checks.
 */
export function registerClassifierValidationChecks(services: ClassifierServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ClassifierValidator;
    const checks: ValidationChecks<CrystalCoreLanguageAstType> = {
        Classifier: validator.checkNameStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ClassifierValidator extends NameableNodeValidator {

}