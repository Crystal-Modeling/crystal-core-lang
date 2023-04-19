import { BoundaryObject, Module, isModule } from "../generated/ast";

export class QualifiedNameProvider {

    private readonly DOT = '.';

    /**
     * @param pack a `Package` or `BoundaryObject` containing the element
     * @param name a simple name of the element
     * @returns qualified name separated by `.`
     */
    getQualifiedName(qualifier: Module | BoundaryObject, name: string): string {
        let prefix: string;
        if (isModule(qualifier)) {
            prefix = qualifier.package.name;
        } else {
            prefix = this.getQualifiedName(qualifier.$container, qualifier.name);
        }
        return (prefix ? prefix + this.DOT : '') + name;
    }

    /**
     * @param qualifiedName name separated by `.`
     * @returns the name token after last `.` in `qualifiedName`
     */
    getSimpleName(qualifiedName: string): string {
        const lastDotIndex = qualifiedName.lastIndexOf(this.DOT);
        return qualifiedName.substring(lastDotIndex + 1);
    }

    /**
     * @param name Name to test whether it is fully qualified or simple one
     * @returns `true` if `name` contains `.` in it or `false` otherwise
     */
    isQualifiedName(name: string): boolean {
        return name.includes(this.DOT);
    }

}
