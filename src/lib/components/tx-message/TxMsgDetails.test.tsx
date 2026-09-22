import { renderToStaticMarkup } from "react-dom/server";

import { generateReceipts } from "./msg-receipts";
import { TxMsgDetails } from "./TxMsgDetails";

jest.mock("lib/app-provider", () => ({
  useGetAddressType: () => () => "invalid_address",
}));

jest.mock("./msg-receipts", () => ({
  generateReceipts: jest.fn(() => []),
}));

jest.mock("./EventBox", () => ({
  EventBox: () => <div data-testid="event-box" />,
}));

jest.mock("lib/components/tx", () => ({
  TxReceiptRender: () => null,
}));

jest.mock("lib/components/DividerWithArrow", () => ({
  DividerWithArrow: () => null,
}));

const log = {
  events: [{ attributes: [{ key: "data", value: "{}" }], type: "move" }],
  log: "",
  msg_index: 0,
} as never;
const msgBody = { "@type": "/initia.move.v1.MsgExecute" } as never;

describe("TxMsgDetails", () => {
  it("renders nothing until first expanded", () => {
    const markup = renderToStaticMarkup(
      <TxMsgDetails
        compact={false}
        isExpand={false}
        log={log}
        msgBody={msgBody}
        msgCount={2}
      />
    );

    expect(markup).toBe("");
    expect(generateReceipts).not.toHaveBeenCalled();
  });

  it("renders event boxes when expanded", () => {
    const markup = renderToStaticMarkup(
      <TxMsgDetails
        compact={false}
        isExpand
        log={log}
        msgBody={msgBody}
        msgCount={2}
      />
    );

    expect(markup).toContain("event-box");
  });
});
