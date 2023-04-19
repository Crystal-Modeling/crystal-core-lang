import { Package } from "../generated/ast";

export class QualifiedNameProvider {

    private readonly DOT = '.';

    /**
     * @param pack a package containing the element
     * @param name a simple name of the element
     * @returns qualified name separated by `.`
     */
    getQualifiedName(pack: Package, name: string): string {
        const prefix = pack.name;
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
