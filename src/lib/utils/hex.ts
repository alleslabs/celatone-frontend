export const uint8ArrayToHexString = (uint8Array: Uint8Array) =>
  Array.from(uint8Array)
    .map((i) => i.toString(16).padStart(2, "0"))
    .join("");
