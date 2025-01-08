import { feeFromStr } from "./fee";

describe("fee validation", () => {
  test("standard case", () => {
    const fee = feeFromStr("10000uosmo");

    expect(fee).toEqual({
      amount: [{ denom: "uosmo", amount: "10000" }],
      gas: "0",
    });
  });

  test("undefined input handling", () => {
    const fee = feeFromStr(undefined);

    expect(fee).toBeUndefined();
  });

  test("multiple coin types", () => {
    const fee = feeFromStr("10000uosmo,89999ustake");

    expect(fee).toEqual({
      amount: [
        { denom: "uosmo", amount: "10000" },
        { denom: "ustake", amount: "89999" },
      ],
      gas: "0",
    });
  });
});
