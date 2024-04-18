import { decode, encode, libDecode, libEncode } from "./base64";

describe("base64 utility functions", () => {
  const testString = "Hello, world!";

  it("should encode a string to base64", () => {
    const encoded = encode(testString);
    expect(encoded).toEqual("SGVsbG8sIHdvcmxkIQ==");
  });

  it("should decode a base64 string to a string", () => {
    const decoded = decode("SGVsbG8sIHdvcmxkIQ==");
    expect(decoded).toEqual(testString);
  });

  it("should use js-base64 library for encoding and decoding", () => {
    const encoded = libEncode(testString);
    const decoded = libDecode(encoded);
    expect(decoded).toEqual(testString);
  });
});
