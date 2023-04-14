import { Packageable } from "./fragments";

export class QualifiedNameProvider {

    /**
     * @param qualifier if the qualifier is a `string`, simple string concatenation is done: `qualifier.name`.
     *      if the qualifier is a `Packageable` fully qualified name is created: `package1.package2.name`.
     * @param name simple name
     * @returns qualified name separated by `.`
     */
    getQualifiedName(qualifier: Packageable, name: string): string {
        const prefix = qualifier.package;
        return (prefix ? prefix + '.' : '') + name;
    }

}
