import { TxReceiptRender } from "lib/components/tx";
import { renderToStaticMarkup } from "react-dom/server";

import { EventBox } from "./EventBox";

jest.mock("lib/app-provider", () => ({
  useGetAddressType: () => () => "invalid_address",
}));

jest.mock("lib/components/tx", () => ({
  TxReceiptRender: jest.fn(() => null),
}));

jest.mock("lib/utils", () => ({
  ...jest.requireActual("lib/utils/format"),
  ...jest.requireActual("lib/utils/json"),
}));

jest.mock("lib/amplitude", () => ({}));
jest.mock("lib/components/ExplorerLink", () => ({}));
jest.mock("lib/components/json/JsonReadOnly", () => () => null);

describe("EventBox", () => {
  it("escapes control bytes in attribute values", () => {
    renderToStaticMarkup(
      <EventBox
        event={{
          attributes: [
            { key: "success", value: "\u0001" },
            { key: "msg_index", value: "1" },
          ],
          type: "fungible_token_packet",
        }}
        msgIndex={4}
      />
    );

    const { receipts } = jest.mocked(TxReceiptRender).mock.lastCall![0];

    expect(receipts.map(({ title, value }) => [title, value])).toEqual([
      ["success", "\\x01"],
      ["msg_index", "1"],
    ]);
  });

  it("keeps JSON with DEL in the JSON viewer", () => {
    const memo = '{"note":"gm\u007F"}';

    renderToStaticMarkup(
      <EventBox
        event={{
          attributes: [{ key: "memo", value: memo }],
          type: "fungible_token_packet",
        }}
        msgIndex={4}
      />
    );

    const [receipt] = jest.mocked(TxReceiptRender).mock.lastCall![0].receipts;

    expect(receipt).toHaveProperty("value", memo);
    expect(receipt).toHaveProperty("html");
  });
});
