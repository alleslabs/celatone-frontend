export type Dict<K extends number | string, T> = Partial<Record<K, T>>;

export type Option<T> = T | undefined;

export type Nullable<T> = T | null;

export type Nullish<T> = T | null | undefined;

export type NominalType<T extends string> = { __type: T };
