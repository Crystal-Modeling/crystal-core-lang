import { ValidationAcceptor, ValidationChecks } from 'langium';
import { CrystalCoreLanguageAstType, Person } from './generated/ast';
import type { CrystalCoreLanguageServices } from './crystal-core-language-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CrystalCoreLanguageServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.CrystalCoreLanguageValidator;
    const checks: ValidationChecks<CrystalCoreLanguageAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CrystalCoreLanguageValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
