import { Flex, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type {
  BechAddr32,
  ContractHistoryRemark,
  ContractInfo,
  Nullish,
  Option,
  WasmVerifyInfo,
} from "lib/types";
import { RemarkOperation } from "lib/types";
import { dateFromNow, formatUTC, getWasmVerifyStatus } from "lib/utils";

import { ContractInstantiatorCell } from "./ContractInstantiatorCell";

interface ContractsTableMobileCardProps {
  contractInfo: ContractInfo;
  onRowSelect: (contract: BechAddr32) => void;
  showLastUpdate: boolean;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

const InstantiatorRemark = ({
  remark,
}: {
  remark: Option<ContractHistoryRemark>;
}) => {
  if (!remark) return <MobileLabel label="Instantiated by" />;

  if (
    remark.operation ===
    RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS
  )
    return <MobileLabel label="Genesis" />;

  if (
    remark.operation ===
    RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE
  )
    return <MobileLabel label="Migrated by" />;

  return <MobileLabel label="Instantiated by" />;
};

export const ContractsTableMobileCard = ({
  contractInfo,
  onRowSelect,
  showLastUpdate,
  wasmVerifyInfo,
}: ContractsTableMobileCardProps) => (
  <MobileCardTemplate
    middleContent={
      showLastUpdate && (
        <Flex gap={3} w="full" direction="column">
          <div>
            <MobileLabel label="Contract Name" />
            <Text
              maxW="full"
              variant="body2"
              color="text.main"
              wordBreak="break-all"
            >
              {contractInfo.name ?? contractInfo.label}
            </Text>
          </div>
          <div>
            <InstantiatorRemark remark={contractInfo.remark} />
            <ContractInstantiatorCell
              isReadOnly={false}
              contractInfo={contractInfo}
            />
          </div>
        </Flex>
      )
    }
    bottomContent={
      contractInfo.latestUpdated ? (
        <div>
          <Text variant="body3">{formatUTC(contractInfo.latestUpdated)}</Text>
          <Text variant="body3" color="text.dark">
            {`(${dateFromNow(contractInfo.latestUpdated)})`}
          </Text>
        </div>
      ) : null
    }
    onClick={() => onRowSelect(contractInfo.contractAddress)}
    topContent={
      <Flex align="center" gap={2}>
        <MobileLabel label="Contract Address" variant="body2" />
        <ExplorerLink
          type="contract_address"
          value={contractInfo.contractAddress}
          rightIcon={
            contractInfo.codeId ? (
              <WasmVerifyBadge
                status={getWasmVerifyStatus(wasmVerifyInfo)}
                linkedCodeId={contractInfo.codeId}
                relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              />
            ) : undefined
          }
        />
      </Flex>
    }
  />
);
