import { zHexAddr20 } from "lib/types";

import { toChecksumAddress } from "./address";

describe("toChecksumAddress", () => {
  test("valid case 1", () => {
    const expected = "0x5E5f1a92eECA58053E8364630b66763aa6265Ab0";
    const result = toChecksumAddress(zHexAddr20.parse(expected.toLowerCase()));
    expect(result).toEqual(expected);
  });

  test("valid case 2", () => {
    const expected = "0xECaba3318f3B8a87504a8bE0c1D4a1D6e6B3447E";
    const result = toChecksumAddress(zHexAddr20.parse(expected.toLowerCase()));
    expect(result).toEqual(expected);
  });

  test("valid case 3", () => {
    const expected = "0xea61cfA2508A27b149D475C9DDD89C77846Baaa6";
    const result = toChecksumAddress(zHexAddr20.parse(expected.toLowerCase()));
    expect(result).toEqual(expected);
  });

  test("valid case 4", () => {
    const expected = "0x7BDe05B0E0CFEB70ac7C523788144c48427fD919";
    const result = toChecksumAddress(zHexAddr20.parse(expected.toLowerCase()));
    expect(result).toEqual(expected);
  });

  test("valid case 5", () => {
    const expected = "0x19b95Ef8a6B4C4CcbdEaa76Fe03eB86C89b6AB6C";
    const result = toChecksumAddress(zHexAddr20.parse(expected.toLowerCase()));
    expect(result).toEqual(expected);
  });
});
