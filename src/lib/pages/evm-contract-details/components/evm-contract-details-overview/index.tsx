import type {
  BechAddr,
  BechAddr20,
  HexAddr20,
  Nullish,
  Option,
  EvmVerifyInfo,
} from "lib/types";

import { Stack } from "@chakra-ui/react";
import { AssetsSection } from "lib/components/asset";
import { EvmVerifySection } from "lib/components/evm-verify-section";

import type { TxsTabIndex } from "../../types";

import { EvmContractDetailsTxs } from "../EvmContractDetailsTxs";
import { OverviewInfo } from "./OverviewInfo";
import { OverviewVerifiedCmds } from "./OverviewVerifiedCmds";
import { OverviewVerifiedInfo } from "./OverviewVerifiedInfo";
import { OverviewVerifiedProxyTargetCmds } from "./OverviewVerifiedProxyTargetCmds";

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
  created,
  evmHash,
  evmVerifyInfo,
  hash,
  isContractInfoLoading,
  onViewMoreAssets,
  onViewMoreTxs,
  proxyTargetEvmVerifyInfo,
  sender,
  setTab,
  tab,
}: EvmContractDetailsOverviewProps) => (
  <Stack gap={8}>
    <EvmVerifySection
      contractAddress={contractAddressHex}
      evmVerifyInfo={evmVerifyInfo}
    />
    <OverviewInfo
      created={created}
      evmHash={evmHash}
      hash={hash}
      isContractInfoLoading={isContractInfoLoading}
      sender={sender}
    />
    {evmVerifyInfo?.isVerified && (
      <>
        <OverviewVerifiedInfo evmVerifyInfo={evmVerifyInfo} />
        <OverviewVerifiedCmds
          contractAddress={contractAddressHex}
          evmVerifyInfo={evmVerifyInfo}
        />
      </>
    )}
    {proxyTargetEvmVerifyInfo?.isVerified && (
      <OverviewVerifiedProxyTargetCmds
        contractAddress={contractAddressHex}
        proxyTargetEvmVerifyInfo={proxyTargetEvmVerifyInfo}
      />
    )}
    <AssetsSection
      address={contractAddressBech}
      onViewMore={onViewMoreAssets}
    />
    <EvmContractDetailsTxs
      address={contractAddressBech}
      setTab={setTab}
      tab={tab}
      onViewMore={onViewMoreTxs}
    />
  </Stack>
);
