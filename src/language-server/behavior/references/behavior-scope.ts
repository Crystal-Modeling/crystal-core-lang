import { ReferenceInfo } from "langium";
import { ImportsContainer } from "../../shared-core/grammar/core-fragments";
import { CrystalCoreScopeProvider } from "../../shared-core/references/core-scope";
import { Workspace, isWorkspace } from "../../generated/ast";

export class BehaviorScopeProvider extends CrystalCoreScopeProvider {

    protected override isImportStatement(_context: ReferenceInfo): boolean {
        const importsWorkspaceProp: keyof Workspace = 'imports';

        return isWorkspace(_context.container) && _context.property === importsWorkspaceProp;
    }

    protected override isValidRootNode(rootNode: ImportsContainer): boolean {
        return isWorkspace(rootNode);
    }

}