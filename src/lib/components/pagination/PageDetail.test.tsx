import { renderToStaticMarkup } from "react-dom/server";

import { PageDetail } from "./PageDetail";

jest.mock("lib/amplitude", () => ({}));

const renderPageSizes = (maxPageSize?: number) =>
  Array.from(
    renderToStaticMarkup(
      <PageDetail
        lastDataInPage={10}
        maxPageSize={maxPageSize}
        offsetData={1}
        pageSize={10}
        totalData={2033}
        onPageSizeChange={() => {}}
      />
    ).matchAll(/<option[^>]*value="(\d+)"/g),
    ([, value]) => Number(value)
  );

describe("PageDetail", () => {
  it("offers every page size by default", () => {
    expect(renderPageSizes()).toEqual([10, 20, 50, 100]);
  });

  it("hides page sizes above maxPageSize", () => {
    expect(renderPageSizes(20)).toEqual([10, 20]);
  });
});
