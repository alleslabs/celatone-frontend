import MockDate from "mockdate";

import {
  dateFromNow,
  formatDuration,
  formatHHmm,
  formatSeconds,
  formatUTC,
  getCurrentDate,
  getDefaultDate,
  parseDate,
  parseDateDefault,
  parseDateOpt,
} from "./date";

const MOCK_CURRENT_ISO = "2026-06-06T06:00:00.000Z";
const DEFAULT_ISO = "1970-01-01T00:00:00.000Z";

beforeEach(() => {
  MockDate.set(new Date(MOCK_CURRENT_ISO));
});

afterEach(() => {
  MockDate.reset();
});

describe("getDefaultDate", () => {
  test("should correctly return default date", () => {
    expect(getDefaultDate().toISOString()).toEqual(DEFAULT_ISO);
  });
});

describe("getCurrentDate", () => {
  test("should correctly return current date", () => {
    expect(getCurrentDate().toISOString()).toEqual(MOCK_CURRENT_ISO);
  });
});

describe("parseDate", () => {
  test("should correctly parse date from string", () => {
    let d = "2018";
    expect(parseDate(d).toISOString()).toEqual("2018-01-01T00:00:00.000Z");
    d = "2018-04";
    expect(parseDate(d).toISOString()).toEqual("2018-04-01T00:00:00.000Z");
    d = "2018-04-24";
    expect(parseDate(d).toISOString()).toEqual("2018-04-24T00:00:00.000Z");
    d = "2018-04-24 11:12";
    expect(parseDate(d).toISOString()).toEqual("2018-04-24T11:12:00.000Z");
    d = "2018-05-02 11:12:13";
    expect(parseDate(d).toISOString()).toEqual("2018-05-02T11:12:13.000Z");
    d = "2018-05-02 11:12:13.998";
    expect(parseDate(d).toISOString()).toEqual("2018-05-02T11:12:13.998Z");
    d = "2018036187";
    expect(parseDate(d).toISOString()).toEqual("2018-05-03T15:00:00.000Z");
  });
});

describe("parseDateOpt", () => {
  test("should correctly parse date from string", () => {
    let d = "2018";
    expect(parseDateOpt(d)?.toISOString()).toEqual("2018-01-01T00:00:00.000Z");
    d = "2018-04";
    expect(parseDateOpt(d)?.toISOString()).toEqual("2018-04-01T00:00:00.000Z");
    d = "2018-04-24";
    expect(parseDateOpt(d)?.toISOString()).toEqual("2018-04-24T00:00:00.000Z");
    d = "2018-04-24 11:12";
    expect(parseDateOpt(d)?.toISOString()).toEqual("2018-04-24T11:12:00.000Z");
    d = "2018-05-02 11:12:13";
    expect(parseDateOpt(d)?.toISOString()).toEqual("2018-05-02T11:12:13.000Z");
    d = "2018-05-02 11:12:13.998";
    expect(parseDateOpt(d)?.toISOString()).toEqual("2018-05-02T11:12:13.998Z");
    d = "2018036187";
    expect(parseDateOpt(d)?.toISOString()).toEqual("2018-05-03T15:00:00.000Z");
  });
  test("should correctly return undefined for undefined/falsy parameter", () => {
    // undefined and falsy cases
    expect(parseDateOpt(undefined)).toBeUndefined();
    expect(parseDateOpt("")).toBeUndefined();
  });
});

describe("parseDateDefault", () => {
  test("should correctly parse date from string", () => {
    let d = "2018";
    expect(parseDateDefault(d).toISOString()).toEqual(
      "2018-01-01T00:00:00.000Z"
    );
    d = "2018-04";
    expect(parseDateDefault(d).toISOString()).toEqual(
      "2018-04-01T00:00:00.000Z"
    );
    d = "2018-04-24";
    expect(parseDateDefault(d).toISOString()).toEqual(
      "2018-04-24T00:00:00.000Z"
    );
    d = "2018-04-24 11:12";
    expect(parseDateDefault(d).toISOString()).toEqual(
      "2018-04-24T11:12:00.000Z"
    );
    d = "2018-05-02 11:12:13";
    expect(parseDateDefault(d).toISOString()).toEqual(
      "2018-05-02T11:12:13.000Z"
    );
    d = "2018-05-02 11:12:13.998";
    expect(parseDateDefault(d).toISOString()).toEqual(
      "2018-05-02T11:12:13.998Z"
    );
    d = "2018036187";
    expect(parseDateDefault(d).toISOString()).toEqual(
      "2018-05-03T15:00:00.000Z"
    );
  });
  test("should correctly return default value for undefined/falsy parameter", () => {
    // undefined and falsy cases
    expect(parseDateDefault(undefined).toISOString()).toEqual(DEFAULT_ISO);
    expect(parseDateDefault("").toISOString()).toEqual(DEFAULT_ISO);
  });
});

describe("formatUTC", () => {
  test("should correctly format date to UTC string", () => {
    let d = parseDate("2018");
    expect(formatUTC(d)).toEqual("Jan 01, 2018, 12:00:00 AM (UTC)");
    d = parseDate("2018-04");
    expect(formatUTC(d)).toEqual("Apr 01, 2018, 12:00:00 AM (UTC)");
    d = parseDate("2018-04-24");
    expect(formatUTC(d)).toEqual("Apr 24, 2018, 12:00:00 AM (UTC)");
    d = parseDate("2018-04-24 11:12");
    expect(formatUTC(d)).toEqual("Apr 24, 2018, 11:12:00 AM (UTC)");
    d = parseDate("2018-05-02 11:12:13");
    expect(formatUTC(d)).toEqual("May 02, 2018, 11:12:13 AM (UTC)");
    d = parseDate("2018-05-02 11:12:13.998");
    expect(formatUTC(d)).toEqual("May 02, 2018, 11:12:13 AM (UTC)");
    d = parseDate("2018036187");
    expect(formatUTC(d)).toEqual("May 03, 2018, 3:00:00 PM (UTC)");
  });
});

describe("formatHHmm", () => {
  test("should correctly format date to HH:mm string", () => {
    let d = parseDate("2018");
    expect(formatHHmm(d)).toEqual("00:00");
    d = parseDate("2018-04");
    expect(formatHHmm(d)).toEqual("00:00");
    d = parseDate("2018-04-24");
    expect(formatHHmm(d)).toEqual("00:00");
    d = parseDate("2018-04-24 11:12");
    expect(formatHHmm(d)).toEqual("11:12");
    d = parseDate("2018-05-02 11:12:13");
    expect(formatHHmm(d)).toEqual("11:12");
    d = parseDate("2018-05-02 11:12:13.998");
    expect(formatHHmm(d)).toEqual("11:12");
    d = parseDate("2018036187");
    expect(formatHHmm(d)).toEqual("15:00");
  });
});

describe("dateFromNow", () => {
  test("(Past) should correctly get date from now", () => {
    // Past
    let d = parseDate("2026-06-06T05:59:30.000Z");
    expect(dateFromNow(d)).toEqual("a few seconds ago");
    d = parseDate("2026-06-06T05:59:00.000Z");
    expect(dateFromNow(d)).toEqual("a minute ago");
    d = parseDate("2026-06-06T05:30:00.000Z");
    expect(dateFromNow(d)).toEqual("30 minutes ago");
    d = parseDate("2026-06-06T05:00:00.000Z");
    expect(dateFromNow(d)).toEqual("an hour ago");
    d = parseDate("2026-06-06T00:00:00.000Z");
    expect(dateFromNow(d)).toEqual("6 hours ago");
    d = parseDate("2026-06-05T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("a day ago");
    d = parseDate("2026-05-31T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("6 days ago");
    d = parseDate("2026-05-06T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("a month ago");
    d = parseDate("2025-12-06T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("6 months ago");
    d = parseDate("2025-06-06T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("a year ago");
    d = parseDate("2012-06-06T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("14 years ago");
  });

  test("(Future) should correctly get date from now", () => {
    // Future
    let d = parseDate("2026-06-06T06:00:30.000Z");
    expect(dateFromNow(d)).toEqual("in a few seconds");
    d = parseDate("2026-06-06T06:00:50.000Z");
    expect(dateFromNow(d)).toEqual("in a minute");
    d = parseDate("2026-06-06T06:30:00.000Z");
    expect(dateFromNow(d)).toEqual("in 30 minutes");
    d = parseDate("2026-06-06T07:00:00.000Z");
    expect(dateFromNow(d)).toEqual("in an hour");
    d = parseDate("2026-06-06T12:00:00.000Z");
    expect(dateFromNow(d)).toEqual("in 6 hours");
    d = parseDate("2026-06-07T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("in a day");
    d = parseDate("2026-06-12T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("in 6 days");
    d = parseDate("2026-07-06T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("in a month");
    d = parseDate("2026-12-06T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("in 6 months");
    d = parseDate("2027-06-06T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("in a year");
    d = parseDate("2040-06-06T06:00:00.000Z");
    expect(dateFromNow(d)).toEqual("in 14 years");
  });
});

describe("formatSeconds", () => {
  test("should correctly format seconds", () => {
    let s = "1000000s";
    expect(formatSeconds(s)).toEqual("11 days");
    s = "86400s";
    expect(formatSeconds(s)).toEqual("1 day");
    s = "7200s";
    expect(formatSeconds(s)).toEqual("2 hours");
    s = "3600s";
    expect(formatSeconds(s)).toEqual("1 hour");
    s = "120s";
    expect(formatSeconds(s)).toEqual("2 minutes");
    s = "60s";
    expect(formatSeconds(s)).toEqual("1 minute");
    s = "30s";
    expect(formatSeconds(s)).toEqual("30 seconds");
    s = "1s";
    expect(formatSeconds(s)).toEqual("1 second");
    s = "0s";
    expect(formatSeconds(s)).toEqual("0 seconds");
  });
  test("should correctly return fallback for undefined/NaN/lesser than 0 parameter", () => {
    expect(formatSeconds(undefined)).toEqual("N/A");
    expect(formatSeconds("")).toEqual("N/A");
    expect(formatSeconds("ABCDEs")).toEqual("N/A");
    expect(formatSeconds("-1s")).toEqual("N/A");
  });
});

describe("formatDuration", () => {
  describe("should return N/A", () => {
    test("empty string", () => {
      expect(formatDuration("")).toEqual("N/A");
    });
    test("space string", () => {
      expect(formatDuration(" ")).toEqual("N/A");
    });
    test("text string", () => {
      expect(formatDuration("invalid value")).toEqual("N/A");
    });
    test("duration doesn't end with h, m, or s", () => {
      expect(formatDuration("1000p")).toEqual("N/A");
    });
    test("duration contains both number and characters", () => {
      expect(formatDuration("123j123n")).toEqual("N/A");
    });
    test("negative number as string", () => {
      expect(formatDuration("-123")).toEqual("N/A");
    });
    test("negative number as number", () => {
      expect(formatDuration(-123)).toEqual("N/A");
    });
    test("duration contains both number and characters", () => {
      expect(formatDuration("123j123n")).toEqual("N/A");
    });
    test("negative number with suffix h", () => {
      expect(formatDuration("-1h")).toEqual("N/A");
    });
    test("duration with capitalize suffix", () => {
      expect(formatDuration("1H")).toEqual("N/A");
    });
    test("duration with valid suffix, but invalid to parse number", () => {
      expect(formatDuration("1fdfh")).toEqual("N/A");
    });
  });

  describe("duration string", () => {
    test("integer number as string", () => {
      expect(formatDuration("1000000000")).toEqual("1 second");
    });
    test("decimal number as string", () => {
      expect(formatDuration("123.123")).toEqual("0.000000123123 seconds");
    });
    test("zero as string", () => {
      expect(formatDuration("0")).toEqual("0 seconds");
    });
    test("1 hour as string with suffix", () => {
      expect(formatDuration("1h")).toEqual("1 hour");
    });
    test("2 hours as string with suffix", () => {
      expect(formatDuration("2h")).toEqual("2 hours");
    });
    test("1 minute as string with suffix", () => {
      expect(formatDuration("1m")).toEqual("1 minute");
    });
    test("2 minutes as string with suffix", () => {
      expect(formatDuration("2m")).toEqual("2 minutes");
    });
    test("1 second as string with suffix", () => {
      expect(formatDuration("1s")).toEqual("1 second");
    });
    test("2 seconds as string with suffix", () => {
      expect(formatDuration("2s")).toEqual("2 seconds");
    });
    test("1 day as string with suffix", () => {
      expect(formatDuration("1d")).toEqual("1 day");
    });
    test("2 days as string with suffix", () => {
      expect(formatDuration("2d")).toEqual("2 days");
    });
  });

  describe("duration number", () => {
    test("zero", () => {
      expect(formatDuration(0)).toEqual("0 seconds");
    });
    test("integer number as number", () => {
      expect(formatDuration(1000000000)).toEqual("1 second");
    });
    test("integer number as exponential", () => {
      expect(formatDuration(1e9)).toEqual("1 second");
    });
    test("decimal number as number", () => {
      expect(formatDuration(123.123)).toEqual("0.000000123123 seconds");
    });
    test("decimal number as binary", () => {
      expect(formatDuration(0b1)).toEqual("0.000000001 seconds");
    });
    test("decimal number as hex", () => {
      expect(formatDuration(0x14)).toEqual("0.00000002 seconds");
    });
  });
});
