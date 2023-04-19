import { LangiumServices } from "langium"
import { QualifiedNameProvider } from "./naming"

export type CrystalCoreAddedServices = {
    references: {
        QualifiedNameProvider: QualifiedNameProvider
    },
}


export type CrystalCoreServices = LangiumServices & CrystalCoreAddedServices