import { BoundaryObject, Module, isModule } from "../generated/ast";

export class QualifiedNameProvider {

    private readonly DOT = '.';

    /**
     * @param pack a `Package` or `BoundaryObject` containing the element
     * @param simpleName a simple name of the element
     * @returns qualified name separated by `.`
     */
    getQualifiedName(qualifier: Module | BoundaryObject, simpleName: string): string {
        let prefix: string;
        if (isModule(qualifier)) {
            prefix = qualifier.package.name;
        } else {
            prefix = this.getQualifiedName(qualifier.$container, qualifier.name);
        }
        return (prefix ? prefix + this.DOT : '') + simpleName;
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
     * @param relativeQualifierName fully qualified name of the container, against which to perform relative qualification.
     * Must be a substring of `qualifiedName`
     * @param qualifiedName qualified name of the element, nested in the relativeQualifier
     * @returns relatively qualified name. For instance, if `qualifiedName` is 'package.Object.operation'
     * and `relativeQualifierName` is 'package.Object', then 'Object.operation' will be returned
     */
    getRelativeName(relativeQualifierName: string, qualifiedName: string): string {
        const nameWithinRelativeQualifier = qualifiedName.substring(relativeQualifierName.length + this.DOT.length);
        const relativeQualifierSimpleName = this.getSimpleName(relativeQualifierName);
        return relativeQualifierSimpleName + this.DOT + nameWithinRelativeQualifier;
    }

    /**
     * @param name Name to test whether it is fully qualified or simple one
     * @returns `true` if `name` contains `.` in it or `false` otherwise
     */
    isQualifiedName(name: string): boolean {
        return name.includes(this.DOT);
    }

}
