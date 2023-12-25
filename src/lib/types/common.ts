export type Dict<K extends string | number, T> = Partial<Record<K, T>>;

export type Option<T> = T | undefined;

export type Nullable<T> = T | null;

export type Nullish<T> = T | null | undefined;

export type NominalType<T extends string> = { __type: T };
