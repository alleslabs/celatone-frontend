import { zHexAddr, zHexAddr20 } from "lib/types";

import { toChecksumAddress, unpadHexAddress } from "./address";

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

describe("unpadHexAddress", () => {
  test("preserves leading zero nibble in 20-byte wallet with non-zero first byte", () => {
    const wallet = "0x0c4b28c50a786ae5501662f4443e8724a0b6fe99";
    expect(unpadHexAddress(zHexAddr.parse(wallet))).toEqual(wallet);
  });

  test("preserves leading zero byte in 20-byte wallet address", () => {
    const wallet = "0x00ab28c50a786ae5501662f4443e8724a0b6fe99";
    expect(unpadHexAddress(zHexAddr.parse(wallet))).toEqual(wallet);
  });

  test.each(["0x1", "0x2", "0x3", "0x5", "0x6", "0x8", "0xc", "0xcc"])(
    "collapses padded short Move address %s to short form",
    (address) => {
      const padded = `0x${address.slice(2).padStart(40, "0")}`;
      expect(unpadHexAddress(zHexAddr.parse(padded))).toEqual(address);
    }
  );

  test("collapses padded 20-byte reserved Move address to short form", () => {
    const padded = "0x0000000000000000000000000000000000000403";
    expect(unpadHexAddress(zHexAddr.parse(padded))).toEqual("0x403");
  });

  test("collapses padded short wallet-length Move address to short form", () => {
    const padded = "0x00000000000000000001";
    expect(unpadHexAddress(zHexAddr.parse(padded))).toEqual("0x1");
  });

  test("collapses all-zero 20-byte address to 0x0", () => {
    const padded = "0x0000000000000000000000000000000000000000";
    expect(unpadHexAddress(zHexAddr.parse(padded))).toEqual("0x0");
  });

  test("collapses 32-byte padded module address to short form", () => {
    const padded =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    expect(unpadHexAddress(zHexAddr.parse(padded))).toEqual("0x1");
  });

  test("collapses multi-nibble 32-byte Move address to short form", () => {
    const padded =
      "0x0000000000000000000000000000000000000000000000000000000000000403";
    expect(unpadHexAddress(zHexAddr.parse(padded))).toEqual("0x403");
  });

  test("collapses all-zero address to 0x0", () => {
    const padded =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    expect(unpadHexAddress(zHexAddr.parse(padded))).toEqual("0x0");
  });

  test("passes already-short forms through unchanged", () => {
    const named = "0x1";
    expect(unpadHexAddress(zHexAddr.parse(named))).toEqual(named);
  });
});
