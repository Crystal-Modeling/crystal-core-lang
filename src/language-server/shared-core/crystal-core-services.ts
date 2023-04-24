import { LangiumServices } from "langium"
import { QualifiedNameProvider } from "./references/core-naming"

export type CrystalCoreAddedServices = {
    references: {
        QualifiedNameProvider: QualifiedNameProvider
    },
}


export type CrystalCoreServices = LangiumServices & CrystalCoreAddedServices