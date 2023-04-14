import { QualifiedName } from "../generated/ast";

export interface Packageable {
    package: QualifiedName
}

export function isPackageable(object: any): object is Packageable {
    return 'package' in object;
}