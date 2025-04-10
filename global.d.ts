/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number;
    findLast(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): T | undefined;
  }

  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}
