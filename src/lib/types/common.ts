export type Dict<K extends number | string, T> = Partial<Record<K, T>>;

export type Option<T> = T | undefined;

export type Nullable<T> = null | T;

export type Nullish<T> = null | T | undefined;

export type NominalType<T extends string> = { __type: T };
