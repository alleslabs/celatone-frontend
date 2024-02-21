import { truncate } from "./truncate";

describe("truncate validation", () => {
  test("standard case", () => {
    const result = truncate("osmo102cykl9ng6m9e7ytku25r632shfdk3ux4eayz4");

    expect(result).toBe("osmo10...4eayz4");
  });

  test("custom head and tail length", () => {
    const result = truncate(
      "osmo102cykl9ng6m9e7ytku25r632shfdk3ux4eayz4",
      [10, 4]
    );

    expect(result).toBe("osmo102cyk...ayz4");
  });
});
