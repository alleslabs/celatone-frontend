/* TypeScript file generated from truncate.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as truncateBS__Es6Import from './truncate.bs';
const truncateBS: any = truncateBS__Es6Import;

export const truncate: (_1:{
  readonly text?: string; 
  readonly h?: number; 
  readonly t?: number
}, _2:void) => string = function (Arg1: any, Arg2: any) {
  const result = Curry._4(truncateBS.truncate, Arg1.text, Arg1.h, Arg1.t, Arg2);
  return result
};
