import { AstNode, DefaultNameProvider, NameProvider, NamedAstNode } from "langium";
import { AbstractElement, isModule } from "../../generated/ast";
import { CrystalCoreServices } from "../crystal-core-services";

export class QualifiedNameProvider {

    private nameProvider: CrystalCoreNameProvider

    constructor(services: CrystalCoreServices) {
        this.nameProvider = services.references.NameProvider
    }

    private static readonly DOT = '.';

    /**
     * @param element the element to be qualified
     * @param name a name of the element. If no name is supplied, one supplied by {@link CrystalCoreNameProvider} is used
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
        const lastDotIndex = qualifiedName.lastIndexOf(QualifiedNameProvider.DOT);
        return qualifiedName.substring(lastDotIndex + 1);
    }

    /**
     * @param prefixName 
     * @param name 
     * @returns `name` qualified by `prefixName`
     */
    qualifyBy(prefixName: string | undefined, element: NamedAstNode): string
    qualifyBy(prefixName: string | undefined, element: AstNode): undefined
    qualifyBy(prefixName: string | undefined, element: AstNode): string | undefined {
        const name = this.nameProvider.getName(element)
        if (!name) {
            return undefined
        }
        return this.combineNames(prefixName, name)
    }

    protected combineNames(prefixName: string | undefined, name: string): string {
        return (prefixName ? prefixName + QualifiedNameProvider.DOT : '') + name;
    }

    /**
     * @param name Name to test whether it is fully qualified or simple one
     * @returns `true` if `name` contains `.` in it or `false` otherwise
     */
    isQualifiedName(name: string): boolean {
        return name.includes(QualifiedNameProvider.DOT);
    }

}

export class CrystalCoreNameProvider extends DefaultNameProvider implements NameProvider {

    override getName(node: NamedAstNode): string
    override getName(node: AstNode): undefined
    override getName(node: AstNode): string | undefined {
        return super.getName(node);
    }
}