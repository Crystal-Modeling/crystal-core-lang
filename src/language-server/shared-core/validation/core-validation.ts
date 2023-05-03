import { NamedAstNode, ValidationAcceptor } from "langium";
import { CrystalCoreNameProvider } from "../references/core-naming";
import { CrystalCoreServices } from "../crystal-core-services";

export abstract class NamedAstNodeValidator {

    private nameProvider: CrystalCoreNameProvider

    public constructor(services: CrystalCoreServices) {
        this.nameProvider = services.references.NameProvider
    }

    checkNameStartsWithCapital(node: NamedAstNode, accept: ValidationAcceptor): void {
        const name = this.nameProvider.getName(node)
        const firstChar = name.substring(0, 1);
        if (firstChar.toUpperCase() !== firstChar) {
            accept('warning', `${node.$type} name should start with a capital.`, { node: node, property: 'name' });
        }
    }

    checkNameStartsWithLowercase(node: NamedAstNode, accept: ValidationAcceptor): void {
        const name = this.nameProvider.getName(node)
        const firstChar = name.substring(0, 1);
        if (firstChar.toLowerCase() !== firstChar) {
            accept('warning', `${node.$type} name should start with a lowercase character.`, { node: node, property: 'name' });
        }
    }
}