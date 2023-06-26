import type { Big, BigSource } from "big.js";
import big from "big.js";

import type { Token, U, USD } from "lib/types";

import {
  formatDecimal,
  d2Formatter,
  d6Formatter,
  toToken,
  formatUTokenWithPrecision,
  formatPrice,
  formatInteger,
} from "./token";

const FALLBACK = "fallback";

describe("formatDecimal", () => {
  const f = formatDecimal({ decimalPoints: 4, delimiter: false });
  const fDelim = formatDecimal({ decimalPoints: 4, delimiter: true });

  test("invalid", () => {
    expect(f("invalid value", FALLBACK)).toEqual(FALLBACK);
    expect(f(NaN, FALLBACK)).toEqual(FALLBACK);
    expect(f("0x13ac", FALLBACK)).toEqual(FALLBACK);
  });

  test("from string", () => {
    expect(f("12345678", FALLBACK)).toEqual("12345678.0000");
    expect(f("12345.678", FALLBACK)).toEqual("12345.6780");

    expect(f("-12345678", FALLBACK)).toEqual("-12345678.0000");
    expect(f("-12345.678", FALLBACK)).toEqual("-12345.6780");

    expect(fDelim("123", FALLBACK)).toEqual("123.0000");
    expect(fDelim("01234", FALLBACK)).toEqual("1,234.0000");
    expect(fDelim("12340", FALLBACK)).toEqual("12,340.0000");
    expect(fDelim("12345678", FALLBACK)).toEqual("12,345,678.0000");
    expect(fDelim("12345.678", FALLBACK)).toEqual("12,345.6780");
    expect(fDelim("123.45678", FALLBACK)).toEqual("123.4567");

    expect(fDelim("-123", FALLBACK)).toEqual("-123.0000");
    expect(fDelim("-01234", FALLBACK)).toEqual("-1,234.0000");
    expect(fDelim("-12340", FALLBACK)).toEqual("-12,340.0000");
    expect(fDelim("-12345678", FALLBACK)).toEqual("-12,345,678.0000");
    expect(fDelim("-12345.678", FALLBACK)).toEqual("-12,345.6780");
    expect(fDelim("-123.45678", FALLBACK)).toEqual("-123.4567");
  });

  test("from number", () => {
    expect(f(12345678, FALLBACK)).toEqual("12345678.0000");
    expect(f(12345.678, FALLBACK)).toEqual("12345.6780");

    expect(f(-12345678, FALLBACK)).toEqual("-12345678.0000");
    expect(f(-12345.678, FALLBACK)).toEqual("-12345.6780");

    expect(fDelim(123, FALLBACK)).toEqual("123.0000");
    expect(fDelim(12340, FALLBACK)).toEqual("12,340.0000");
    expect(fDelim(12345678, FALLBACK)).toEqual("12,345,678.0000");
    expect(fDelim(12345.678, FALLBACK)).toEqual("12,345.6780");
    expect(fDelim(123.45678, FALLBACK)).toEqual("123.4567");

    expect(fDelim(-123, FALLBACK)).toEqual("-123.0000");
    expect(fDelim(-12340, FALLBACK)).toEqual("-12,340.0000");
    expect(fDelim(-12345678, FALLBACK)).toEqual("-12,345,678.0000");
    expect(fDelim(-12345.678, FALLBACK)).toEqual("-12,345.6780");
    expect(fDelim(-123.45678, FALLBACK)).toEqual("-123.4567");
  });

  test("from big", () => {
    expect(f(big(1234), FALLBACK)).toEqual("1234.0000");
    expect(f(big(123456.789), FALLBACK)).toEqual("123456.7890");

    expect(f(big(-123456789), FALLBACK)).toEqual("-123456789.0000");
    expect(f(big(-123456.789), FALLBACK)).toEqual("-123456.7890");

    expect(fDelim(big(123456.789), FALLBACK)).toEqual("123,456.7890");
    expect(fDelim(big(123.456789), FALLBACK)).toEqual("123.4567");

    expect(fDelim(big(-123456.789), FALLBACK)).toEqual("-123,456.7890");
    expect(fDelim(big(-123.456789), FALLBACK)).toEqual("-123.4567");
  });
});

describe("d2Formatter", () => {
  test("positive", () => {
    expect(d2Formatter("1234.5678", FALLBACK)).toEqual("1,234.56");
    expect(d2Formatter(1234.5, FALLBACK)).toEqual("1,234.50");
  });
  test("negative", () => {
    expect(d2Formatter("-1234.5678", FALLBACK)).toEqual("-1,234.56");
    expect(d2Formatter(-1234.5, FALLBACK)).toEqual("-1,234.50");
  });
});

describe("d6Formatter", () => {
  test("positive", () => {
    expect(d6Formatter("0.123456789", FALLBACK)).toEqual("0.123456");
    expect(d6Formatter(0.1234, FALLBACK)).toEqual("0.123400");
  });
  test("negative", () => {
    expect(d6Formatter("-0.123456789", FALLBACK)).toEqual("-0.123456");
    expect(d6Formatter(-0.1234, FALLBACK)).toEqual("-0.123400");
  });
});

describe("toToken", () => {
  test("invalid", () => {
    expect(toToken(NaN as U<Token<BigSource>>, 6)).toEqual(
      big(0) as Token<Big>
    );
  });
  test("more than 1", () => {
    expect(toToken(12345678 as U<Token<BigSource>>, 6)).toEqual(
      big(12.345678) as Token<Big>
    );
  });
  test("less than 1", () => {
    expect(toToken(1234 as U<Token<BigSource>>, 6)).toEqual(
      big(0.001234) as Token<Big>
    );
  });
});

describe("formatUTokenWithPrecision", () => {
  test("invalid", () => {
    expect(
      formatUTokenWithPrecision("" as U<Token<BigSource>>, 6, false)
    ).toEqual("0.000000");
    expect(
      formatUTokenWithPrecision(NaN as U<Token<BigSource>>, 8, false)
    ).toEqual("0.00000000");
    expect(
      formatUTokenWithPrecision(NaN as U<Token<BigSource>>, 6, true, 3)
    ).toEqual("0.000");
  });
  test("no suffix", () => {
    expect(
      formatUTokenWithPrecision(
        "12345678901234567890" as U<Token<BigSource>>,
        6,
        false
      )
    ).toEqual("12,345,678,901,234.567890");
    expect(
      formatUTokenWithPrecision(
        "12345678901234567890" as U<Token<BigSource>>,
        6,
        false,
        2
      )
    ).toEqual("12,345,678,901,234.56");
    expect(
      formatUTokenWithPrecision(
        "12345678901234567890" as U<Token<BigSource>>,
        6,
        false,
        8
      )
    ).toEqual("12,345,678,901,234.56789000");
  });
  test("with suffix", () => {
    expect(
      formatUTokenWithPrecision(
        "12345678901234567890" as U<Token<BigSource>>,
        6,
        true
      )
    ).toEqual("12,345.67B");
    expect(
      formatUTokenWithPrecision(
        "12345678901234" as U<Token<BigSource>>,
        6,
        true
      )
    ).toEqual("12.34M");
    expect(
      formatUTokenWithPrecision("1234567890" as U<Token<BigSource>>, 6, true)
    ).toEqual("1,234.56");
    expect(
      formatUTokenWithPrecision("123456789" as U<Token<BigSource>>, 6, true)
    ).toEqual("123.456789");
    expect(
      formatUTokenWithPrecision("123456789" as U<Token<BigSource>>, 6, true, 3)
    ).toEqual("123.456");
  });
});

describe("formatPrice", () => {
  test("invalid", () => {
    expect(formatPrice(NaN as USD<BigSource>)).toEqual("$0.00");
    expect(formatPrice("" as USD<BigSource>)).toEqual("$0.00");
  });
  test("0", () => {
    expect(formatPrice(0 as USD<BigSource>)).toEqual("$0.00");
  });
  test("> 1", () => {
    expect(formatPrice(1.0 as USD<BigSource>)).toEqual("$1.00");
    expect(formatPrice(1.234 as USD<BigSource>)).toEqual("$1.23");
  });
  test("< 0.000001", () => {
    expect(formatPrice(0.0000001 as USD<BigSource>)).toEqual("<$0.000001");
  });
  test("0.000001 <= x < 1", () => {
    expect(formatPrice(0.123 as USD<BigSource>)).toEqual("$0.123000");
    expect(formatPrice(0.123456789 as USD<BigSource>)).toEqual("$0.123456");
  });
});

describe("formatInteger", () => {
  test("invalid", () => {
    expect(formatInteger(NaN as BigSource)).toEqual("Not Available");
    expect(formatInteger("" as BigSource)).toEqual("Not Available");
  });
  test("valid", () => {
    expect(formatInteger("1234.567890" as BigSource)).toEqual("1,234");
    expect(formatInteger(1234 as BigSource)).toEqual("1,234");
  });
});
