export type Dict<K extends string | number, T> = Partial<Record<K, T>>;

export type Option<T> = T | undefined;
