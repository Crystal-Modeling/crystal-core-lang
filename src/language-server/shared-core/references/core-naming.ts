import { AstNode, NameProvider } from "langium";
import { AbstractElement, BoundaryOperation, isModule } from "../../generated/ast";
import { CrystalCoreServices } from "../crystal-core-services";

export class QualifiedNameProvider {

    private nameProvider: NameProvider

    constructor(services: CrystalCoreServices) {
        this.nameProvider = services.references.NameProvider
    }

    private readonly DOT = '.';

    /**
     * @param element the element to be qualified
     * @param name a name of the element. If no name is supplied, one supplied by {@link NameProvider} is used
     * @returns qualified name separated by `.`
     */
    getQualifiedName(element: AbstractElement, name?: string): string;
    getQualifiedName(element: AstNode, name?: string): string | undefined
    getQualifiedName(element: AstNode, name?: string): string | undefined {
        name ??= this.nameProvider.getName(element)
        if (!name) {
            return undefined
        }
        const qualifier = element.$container
        let prefix: string | undefined;
        if (!qualifier) {
            prefix = ''
        } else if (isModule(qualifier)) {
            prefix = qualifier.package.name;
        } else {
            prefix = this.getQualifiedName(qualifier as AstNode);
        }
        return this.combineNames(prefix, name);
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
     * @param prefixName 
     * @param name 
     * @returns `name` qualified by `prefixName`
     */
    qualifyBy(prefixName: string | undefined, element: BoundaryOperation): string
    qualifyBy(prefixName: string | undefined, element: AstNode): string | undefined
    qualifyBy(prefixName: string | undefined, element: AstNode): string | undefined {
        const name = this.nameProvider.getName(element)
        if (!name) {
            return undefined
        }
        return this.combineNames(prefixName, name)
    }

    protected combineNames(prefixName: string | undefined, name: string): string {
        return (prefixName ? prefixName + this.DOT : '') + name;
    }

    /**
     * @param name Name to test whether it is fully qualified or simple one
     * @returns `true` if `name` contains `.` in it or `false` otherwise
     */
    isQualifiedName(name: string): boolean {
        return name.includes(this.DOT);
    }

}
