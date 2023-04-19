import { ReferenceInfo } from "langium";
import { CrystalCoreScopeProvider } from "../crystal-core/scope";
import { Workspace, isWorkspace } from "../generated/ast";

export class BehaviorScopeProvider extends CrystalCoreScopeProvider {

    protected override isImportStatement(_context: ReferenceInfo): boolean {
        const importsWorkspaceProp: keyof Workspace = 'imports';

        return isWorkspace(_context.container) && _context.property === importsWorkspaceProp;
    }

}