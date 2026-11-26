import { renderToStaticMarkup } from "react-dom/server";

import { TxMsgExpand } from "./TxMsgExpand";

jest.mock("lib/amplitude", () => ({}));
jest.mock("lib/app-provider", () => ({
  useGetAddressType: () => () => "invalid_address",
  useMobile: () => false,
}));
jest.mock("lib/components/ExplorerLink", () => ({
  ExplorerLink: ({ value }: { value: string }) => <span>{value}</span>,
}));
jest.mock("lib/components/icon", () => ({ CustomIcon: () => null }));
jest.mock("lib/components/WasmVerifyBadge", () => ({}));
jest.mock("lib/services/assetService", () => ({
  useAssetInfos: () => ({ data: undefined }),
}));
jest.mock("lib/services/move/poolService", () => ({
  useMovePoolInfos: () => ({ data: undefined }),
}));
jest.mock("lib/utils", () => ({
  getTxBadges: () => ({ isEvm: false, isIbc: false, isOpinit: false }),
}));

describe("TxMsgExpand", () => {
  it("renders a MsgSend that carries no coins", () => {
    const markup = renderToStaticMarkup(
      <TxMsgExpand
        compact={false}
        isExpand={false}
        log={undefined}
        msgBody={{
          "@type": "/cosmos.bank.v1beta1.MsgSend",
          amount: [],
          fromAddress: "init1sender",
          toAddress: "1uinit",
        }}
        msgCount={1}
        onClick={() => {}}
      />
    );

    expect(markup).toContain("No assets to");
  });
});
