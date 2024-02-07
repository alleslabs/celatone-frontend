import { shortenName } from "./format";

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
