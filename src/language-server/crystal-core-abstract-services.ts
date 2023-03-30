import { AstNode, ValidationAcceptor } from "langium";

export abstract class NameableNodeValidator {

    checkNameStartsWithCapital(type: AstNode & Nameable, accept: ValidationAcceptor): void {
        if (type.name) {
            const firstChar = type.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', `${type.$type} name should start with a capital.`, { node: type, property: 'name' });
            }
        }
    }

    checkNameStartsWithLowercase(type: AstNode & Nameable, accept: ValidationAcceptor): void {
        if (type.name) {
            const firstChar = type.name.substring(0, 1);
            if (firstChar.toLowerCase() !== firstChar) {
                accept('warning', `${type.$type} name should start with a lowercase character.`, { node: type, property: 'name' });
            }
        }
    }
}

export type Nameable = { name: string }