import { AstNode, ValidationAcceptor, ValidationChecks } from 'langium';
import type { BoundaryObjectServices } from './boundary-object-module';
import { CrystalCoreLanguageAstType } from './generated/ast';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: BoundaryObjectServices) {
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
export class BoundaryObjectValidator {

    checkNameStartsWithCapital(type: AstNode & { name: string }, accept: ValidationAcceptor): void {
        if (type.name) {
            const firstChar = type.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', `${type.$type} name should start with a capital.`, { node: type, property: 'name' });
            }
        }
    }

    checkNameStartsWithLowercase(type: AstNode & { name: string }, accept: ValidationAcceptor): void {
        if (type.name) {
            const firstChar = type.name.substring(0, 1);
            if (firstChar.toLowerCase() !== firstChar) {
                accept('warning', `${type.$type} name should start with a lowercase character.`, { node: type, property: 'name' });
            }
        }
    }

}
