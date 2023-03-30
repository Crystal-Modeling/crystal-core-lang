import {
    createDefaultModule, createDefaultSharedModule, DefaultSharedModuleContext, inject, LangiumSharedServices
} from 'langium';
import { BoundaryObjectModule, BoundaryObjectServices } from './boundary-object/boundary-object-module';
import { registerBoundaryObjectValidationChecks } from './boundary-object/boundary-object-validator';
import { ClassifierModule } from './classifier/classifier-module';
import { registerClassifierValidationChecks } from './classifier/classifier-validator';
import { BoundaryObjectGeneratedModule, ClassifierGeneratedModule, CrystalCoreLanguageGeneratedSharedModule } from './generated/module';


/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createCrystalCoreLanguageServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    boundaryObject: BoundaryObjectServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        CrystalCoreLanguageGeneratedSharedModule
    );
    const boundaryObject = inject(
        createDefaultModule({ shared }),
        BoundaryObjectGeneratedModule,
        BoundaryObjectModule
    );
    const classifier = inject(
        createDefaultModule({ shared }),
        ClassifierGeneratedModule,
        ClassifierModule
    );
    shared.ServiceRegistry.register(boundaryObject);
    shared.ServiceRegistry.register(classifier);
    registerBoundaryObjectValidationChecks(boundaryObject);
    registerClassifierValidationChecks(classifier);
    return { shared, boundaryObject };
}