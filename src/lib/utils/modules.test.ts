import type { Addr } from "lib/types";

import { mergeModulePath, splitModulePath } from "./modules";

describe("splitModulePath", () => {
  test("should split the path into an array with one element", () => {
    const path = "init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d";
    const result = splitModulePath(path);

    expect(result).toEqual([path]);
  });

  test("should split the path into an array with two elements", () => {
    const path = "init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d::any";
    const result = splitModulePath(path);

    expect(result).toEqual([
      "init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d",
      "any",
    ]);
  });

  test("should split the path into an array with three elements", () => {
    const path = "init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d::any::pack";
    const result = splitModulePath(path);

    expect(result).toEqual([
      "init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d",
      "any",
      "pack",
    ]);
  });
});

describe("mergeModulePath", () => {
  const address = "init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d" as Addr;
  test("should concatenate the elements into a string with one element", () => {
    const result = mergeModulePath(address);

    expect(result).toEqual("init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d");
  });

  test("should concatenate the elements into a string with two elements", () => {
    const result = mergeModulePath(address, "any");

    expect(result).toEqual("init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d::any");
  });

  test("should concatenate the elements into a string with three elements", () => {
    const result = mergeModulePath(address, "any", "pack");

    expect(result).toEqual(
      "init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d::any::pack"
    );
  });
});
