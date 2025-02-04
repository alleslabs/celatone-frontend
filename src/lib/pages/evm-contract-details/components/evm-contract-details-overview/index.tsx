import { Stack } from "@chakra-ui/react";

import { AssetsSection } from "lib/components/asset";
import { EvmVerifySection } from "lib/components/evm-verify-section";
import type {
  BechAddr,
  BechAddr20,
  HexAddr20,
  Nullish,
  Option,
} from "lib/types";
import type { TxsTabIndex } from "../../types";

import { EvmContractDetailsTxs } from "../EvmContractDetailsTxs";
import { OverviewInfo } from "./OverviewInfo";
import { OverviewVerifiedInfo } from "./OverviewVerifiedInfo";
import { EvmVerifyInfo } from "lib/services/types";
import { OverviewVerifiedCmds } from "./OverviewVerifiedCmds";

interface EvmContractDetailsOverviewProps {
  contractAddressBech: BechAddr20;
  contractAddressHex: HexAddr20;
  hash: Option<string>;
  evmHash: Nullish<string>;
  sender: Option<BechAddr>;
  created: Option<Date>;
  isContractInfoLoading: boolean;
  onViewMoreAssets: () => void;
  onViewMoreTxs: () => void;
  tab: TxsTabIndex;
  setTab: (tab: TxsTabIndex) => void;
  evmVerifyInfo: Option<EvmVerifyInfo>;
  proxyTargetEvmVerifyInfo: Option<EvmVerifyInfo>;
}

export const EvmContractDetailsOverview = ({
  contractAddressBech,
  contractAddressHex,
  hash,
  evmHash,
  sender,
  created,
  isContractInfoLoading,
  onViewMoreAssets,
  onViewMoreTxs,
  tab,
  setTab,
  evmVerifyInfo,
  proxyTargetEvmVerifyInfo,
}: EvmContractDetailsOverviewProps) => (
  <Stack gap={8}>
    <EvmVerifySection
      contractAddress={contractAddressHex}
      evmVerifyInfo={evmVerifyInfo}
    />
    <OverviewInfo
      hash={hash}
      evmHash={evmHash}
      sender={sender}
      created={created}
      isContractInfoLoading={isContractInfoLoading}
    />
    {evmVerifyInfo?.isVerified && (
      <>
        <OverviewVerifiedInfo evmVerifyInfo={evmVerifyInfo} />
        <OverviewVerifiedCmds
          contractAddress={contractAddressHex}
          evmVerifyInfo={evmVerifyInfo}
          proxyTargetEvmVerifyInfo={proxyTargetEvmVerifyInfo}
        />
      </>
    )}
    <AssetsSection
      address={contractAddressBech}
      onViewMore={onViewMoreAssets}
    />
    <EvmContractDetailsTxs
      address={contractAddressBech}
      onViewMore={onViewMoreTxs}
      tab={tab}
      setTab={setTab}
    />
  </Stack>
);
