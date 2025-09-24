type PrimitiveValue = string | number | boolean;
type ArrayValue = PrimitiveValue[];
type ValidParamValue = PrimitiveValue | ArrayValue | null | undefined;

export type UrlParamsType = Record<string, ValidParamValue>;
