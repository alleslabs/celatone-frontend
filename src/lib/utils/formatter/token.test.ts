/* eslint-disable sonarjs/no-duplicate-string */
import type { Big } from "big.js";

import { big, type Token, type U, type USD } from "lib/types";

import {
  formatDecimal,
  d2Formatter,
  d6Formatter,
  toToken,
  formatUTokenWithPrecision,
  formatPrice,
  formatInteger,
  d0Formatter,
} from "./token";

const FALLBACK = "fallback";

describe("formatDecimal", () => {
  const f = formatDecimal({ decimalPoints: 4, delimiter: false });
  const fDelim = formatDecimal({ decimalPoints: 4, delimiter: true });

  describe("invalid", () => {
    test("empty string", () => {
      expect(f("", FALLBACK)).toEqual(FALLBACK);
    });
    test("non-number string", () => {
      expect(f("invalid value", FALLBACK)).toEqual(FALLBACK);
    });
    test("hexstring is not acceptable", () => {
      expect(f("0x13ac", FALLBACK)).toEqual(FALLBACK);
    });
    test("NaN", () => {
      expect(f(NaN, FALLBACK)).toEqual(FALLBACK);
    });
  });

  test("from string", () => {
    expect(f("12345678", FALLBACK)).toEqual("12345678.0000");
    expect(f("12345.678", FALLBACK)).toEqual("12345.6780");

    expect(f("-12345678", FALLBACK)).toEqual("-12345678.0000");
    expect(f("-12345.678", FALLBACK)).toEqual("-12345.6780");

    expect(fDelim("00.000", FALLBACK)).toEqual("0.0000");
    expect(fDelim("0.0000001", FALLBACK)).toEqual("0.0000");
    expect(fDelim("0.123", FALLBACK)).toEqual("0.1230");
    expect(fDelim("123", FALLBACK)).toEqual("123.0000");
    expect(fDelim("01234", FALLBACK)).toEqual("1,234.0000");
    expect(fDelim("12340", FALLBACK)).toEqual("12,340.0000");
    expect(fDelim("12345678", FALLBACK)).toEqual("12,345,678.0000");
    expect(fDelim("12345.678", FALLBACK)).toEqual("12,345.6780");
    expect(fDelim("123.45678", FALLBACK)).toEqual("123.4567");

    expect(fDelim("-0", FALLBACK)).toEqual("0.0000");
    expect(fDelim("-0.0000001", FALLBACK)).toEqual("0.0000");
    expect(fDelim("-0.123", FALLBACK)).toEqual("-0.1230");
    expect(fDelim("-01.230", FALLBACK)).toEqual("-1.2300");
    expect(fDelim("-123", FALLBACK)).toEqual("-123.0000");
    expect(fDelim("-01234", FALLBACK)).toEqual("-1,234.0000");
    expect(fDelim("-12340", FALLBACK)).toEqual("-12,340.0000");
    expect(fDelim("-12345678", FALLBACK)).toEqual("-12,345,678.0000");
    expect(fDelim("-12345.678", FALLBACK)).toEqual("-12,345.6780");
    expect(fDelim("-123.45678", FALLBACK)).toEqual("-123.4567");
  });

  test("from number", () => {
    expect(f(0xab, FALLBACK)).toEqual("171.0000");
    expect(f(1e2, FALLBACK)).toEqual("100.0000");
    expect(f(0b111, FALLBACK)).toEqual("7.0000");

    expect(f(12345678, FALLBACK)).toEqual("12345678.0000");
    expect(f(12345.678, FALLBACK)).toEqual("12345.6780");

    expect(f(-12345678, FALLBACK)).toEqual("-12345678.0000");
    expect(f(-12345.678, FALLBACK)).toEqual("-12345.6780");

    expect(fDelim(0, FALLBACK)).toEqual("0.0000");
    expect(fDelim(0.123, FALLBACK)).toEqual("0.1230");
    expect(fDelim(123, FALLBACK)).toEqual("123.0000");
    expect(fDelim(12340, FALLBACK)).toEqual("12,340.0000");
    expect(fDelim(12345678, FALLBACK)).toEqual("12,345,678.0000");
    expect(fDelim(12345.678, FALLBACK)).toEqual("12,345.6780");
    expect(fDelim(123.45678, FALLBACK)).toEqual("123.4567");

    expect(fDelim(-0, FALLBACK)).toEqual("0.0000");
    expect(fDelim(-0.123, FALLBACK)).toEqual("-0.1230");
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

describe("d0Formatter", () => {
  test("from string", () => {
    expect(d0Formatter("-1234.5678", FALLBACK)).toEqual("-1,234");
    expect(d0Formatter("1234", FALLBACK)).toEqual("1,234");
  });
  test("from number", () => {
    expect(d0Formatter(1234.5, FALLBACK)).toEqual("1,234");
    expect(d0Formatter(1234, FALLBACK)).toEqual("1,234");
    expect(d0Formatter(-1234.5, FALLBACK)).toEqual("-1,234");
  });
});

describe("d2Formatter", () => {
  test("from string", () => {
    expect(d2Formatter("-1234.5678", FALLBACK)).toEqual("-1,234.56");
    expect(d2Formatter("1234.5678", FALLBACK)).toEqual("1,234.56");
  });
  test("from number", () => {
    expect(d2Formatter(1234.5, FALLBACK)).toEqual("1,234.50");
    expect(d2Formatter(1234, FALLBACK)).toEqual("1,234.00");
    expect(d2Formatter(-1234.5, FALLBACK)).toEqual("-1,234.50");
  });
});

describe("d6Formatter", () => {
  test("from string", () => {
    expect(d6Formatter("0.123456789", FALLBACK)).toEqual("0.123456");
    expect(d6Formatter("-0.123456789", FALLBACK)).toEqual("-0.123456");
  });
  test("from number", () => {
    expect(d6Formatter(0.1234, FALLBACK)).toEqual("0.123400");
    expect(d6Formatter(1234, FALLBACK)).toEqual("1,234.000000");
    expect(d6Formatter(-0.1234, FALLBACK)).toEqual("-0.123400");
  });
});

describe("toToken", () => {
  describe("invalid", () => {
    test("empty string", () => {
      expect(toToken("" as U<Token>, 6)).toEqual(big(0) as Token<Big>);
    });
    test("non-number string", () => {
      expect(toToken("ABC" as U<Token>, 6)).toEqual(big(0) as Token<Big>);
    });
    test("NaN", () => {
      expect(toToken(NaN as U<Token<number>>, 6)).toEqual(big(0) as Token<Big>);
    });
    test("negative number", () => {
      expect(toToken(-1 as U<Token<number>>, 6)).toEqual(big(0) as Token<Big>);
    });
  });
  test("more than 1", () => {
    expect(toToken(12345678 as U<Token<number>>, 6)).toEqual(
      big(12.345678) as Token<Big>
    );
    expect(toToken("123456789" as U<Token>, 6)).toEqual(
      big(123.456789) as Token<Big>
    );
  });
  test("less than 1", () => {
    expect(toToken("0.0" as U<Token>, 6)).toEqual(big(0.0) as Token<Big>);
    expect(toToken(0 as U<Token<number>>, 6)).toEqual(big(0.0) as Token<Big>);
    expect(toToken(1234 as U<Token<number>>, 6)).toEqual(
      big(0.001234) as Token<Big>
    );
    expect(toToken("234" as U<Token>, 6)).toEqual(big(0.000234) as Token<Big>);
  });
});

describe("formatUTokenWithPrecision", () => {
  describe("invalid", () => {
    test("empty string", () => {
      expect(formatUTokenWithPrecision("" as U<Token>, 6, false)).toEqual(
        "0.000000"
      );
      expect(formatUTokenWithPrecision("" as U<Token>, 6, true, 1)).toEqual(
        "0.0"
      );
    });
    test("NaN", () => {
      expect(
        formatUTokenWithPrecision(NaN as U<Token<number>>, 8, false)
      ).toEqual("0.00000000");
      expect(
        formatUTokenWithPrecision(NaN as U<Token<number>>, 6, true, 3)
      ).toEqual("0.000");
    });
  });
  test("too small", () => {
    expect(formatUTokenWithPrecision("0.1" as U<Token>, 6, false)).toEqual(
      "<0.000001"
    );
    expect(formatUTokenWithPrecision("0.1" as U<Token>, 7, false)).toEqual(
      "<0.0000001"
    );
    expect(formatUTokenWithPrecision("0.1" as U<Token>, 6, false, 2)).toEqual(
      "<0.01"
    );
  });
  test("no suffix", () => {
    expect(
      formatUTokenWithPrecision("12345678901234567890" as U<Token>, 6, false)
    ).toEqual("12,345,678,901,234.567890");
    expect(
      formatUTokenWithPrecision("12345678901234567890" as U<Token>, 6, false, 2)
    ).toEqual("12,345,678,901,234.56");
    expect(
      formatUTokenWithPrecision("12345678901234567890" as U<Token>, 6, false, 8)
    ).toEqual("12,345,678,901,234.56789000");
  });
  describe("with suffix", () => {
    test(">= B", () => {
      expect(
        formatUTokenWithPrecision("12345678901234567890" as U<Token>, 6)
      ).toEqual("12,345.67B");
    });
    test(">= M", () => {
      expect(
        formatUTokenWithPrecision(12345678901234 as U<Token<number>>, 6, true)
      ).toEqual("12.34M");
    });
    test(">= K", () => {
      expect(
        formatUTokenWithPrecision(1234567890 as U<Token<number>>, 6, true)
      ).toEqual("1,234.56");
    });
    test("< K", () => {
      expect(
        formatUTokenWithPrecision(123456789 as U<Token<number>>, 6, true)
      ).toEqual("123.456789");
      expect(
        formatUTokenWithPrecision(123456789 as U<Token<number>>, 6, true, 3)
      ).toEqual("123.456");
    });
  });
});

describe("formatPrice", () => {
  describe("invalid", () => {
    test("empty string", () => {
      expect(formatPrice("" as USD)).toEqual("N/A");
    });
    test("NaN", () => {
      expect(formatPrice(NaN as USD<number>)).toEqual("N/A");
    });
    test("negative number", () => {
      expect(formatPrice(-1 as USD<number>)).toEqual("N/A");
    });
  });
  describe("if 0, use 2 decimal points", () => {
    test("from string", () => {
      expect(formatPrice("0" as USD)).toEqual("$0.00");
    });
    test("from number", () => {
      expect(formatPrice(0 as USD<number>)).toEqual("$0.00");
    });
  });
  describe("> 1", () => {
    test("from string", () => {
      expect(formatPrice("1.234" as USD)).toEqual("$1.23");
    });
    test("from number", () => {
      expect(formatPrice(1.0 as USD<number>)).toEqual("$1.00");
      expect(formatPrice(1.23 as USD<number>)).toEqual("$1.23");
    });
  });
  describe("< 0.000001", () => {
    test("from string", () => {
      expect(formatPrice("0.00000001" as USD)).toEqual("<$0.000001");
    });
    test("from number", () => {
      expect(formatPrice(0.0000001 as USD<number>)).toEqual("<$0.000001");
    });
  });
  describe("0.000001 <= x < 1", () => {
    test("from string", () => {
      expect(formatPrice("0.000001" as USD)).toEqual("$0.000001");
      expect(formatPrice("0.123" as USD)).toEqual("$0.123000");
      expect(formatPrice("0.123456789" as USD)).toEqual("$0.123456");
    });
    test("from number", () => {
      expect(formatPrice(0.000001 as USD<number>)).toEqual("$0.000001");
      expect(formatPrice(0.123 as USD<number>)).toEqual("$0.123000");
      expect(formatPrice(0.123456789 as USD<number>)).toEqual("$0.123456");
    });
  });
});

describe("formatInteger", () => {
  describe("invalid", () => {
    test("empty string", () => {
      expect(formatInteger("")).toEqual("N/A");
    });
    test("NaN", () => {
      expect(formatInteger(NaN)).toEqual("N/A");
    });
  });
  describe("valid", () => {
    test("from string", () => {
      expect(formatInteger("1234.567890")).toEqual("1,234");
      expect(formatInteger("-1234.567890")).toEqual("-1,234");
    });
    test("from string", () => {
      expect(formatInteger(1234)).toEqual("1,234");
      expect(formatInteger(-1234)).toEqual("-1,234");
    });
  });
});
