import { LangiumServices, PartialLangiumServices } from "langium"
import { CrystalCoreNameProvider, QualifiedNameProvider } from "./references/core-naming"

type CrystalCoreAddedServices = {
    references: {
        NameProvider: CrystalCoreNameProvider,
        QualifiedNameProvider: QualifiedNameProvider,
    },
}


/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type CrystalCoreServices = LangiumServices & CrystalCoreAddedServices

export type PartialCrystalCoreServices = PartialLangiumServices & CrystalCoreAddedServices