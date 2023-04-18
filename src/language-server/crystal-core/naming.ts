import { Package } from "../generated/ast";

export class QualifiedNameProvider {

    /**
     * @param pack a package containing the element
     * @param name a simple name of the element
     * @returns qualified name separated by `.`
     */
    getQualifiedName(pack: Package, name: string): string {
        const prefix = pack.name;
        return (prefix ? prefix + '.' : '') + name;
    }

    /**
     * @param qualifiedName name separated by `.`
     * @returns the name token after last `.` in `qualifiedName`
     */
    getSimpleName(qualifiedName: string): string {
        const lastDotIndex = qualifiedName.lastIndexOf('.');
        return qualifiedName.substring(lastDotIndex + 1);
    }

}
