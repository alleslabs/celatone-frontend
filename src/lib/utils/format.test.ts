import { escapeControlChars, shortenName } from "./format";

describe("escapeControlChars", () => {
  test("escapes IBC ack success byte", () => {
    expect(escapeControlChars("\u0001")).toBe("\\x01");
  });

  test("escapes NUL and other C0 controls", () => {
    expect(escapeControlChars("a\u0000b\u000Bc\u001F")).toBe(
      "a\\x00b\\x0bc\\x1f"
    );
  });

  test("keeps DEL and C1 controls", () => {
    expect(escapeControlChars("a\u007Fb\u0085")).toBe("a\u007Fb\u0085");
  });

  test("keeps tab, newline and carriage return", () => {
    expect(escapeControlChars("a\tb\nc\r")).toBe("a\tb\nc\r");
  });

  test("leaves printable text unchanged", () => {
    expect(escapeControlChars("init1abc ✓ 100uinit")).toBe(
      "init1abc ✓ 100uinit"
    );
  });
});

describe("shortenName validation", () => {
  test("standard case", () => {
    const name = shortenName("Generate my sentence");

    expect(name).toBe("Generate m...");
  });

  test("custom truncate length", () => {
    const name = shortenName("Hello World!", 5);

    expect(name).toBe("Hello...");
  });

  test("custom truncate length with longer than input string", () => {
    const name = shortenName("Hello", 20);

    expect(name).toBe("Hello");
  });
});
