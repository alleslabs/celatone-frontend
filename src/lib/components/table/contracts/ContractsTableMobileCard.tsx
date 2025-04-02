import type {
  BechAddr32,
  ContractHistoryRemark,
  ContractInfo,
  Nullish,
  Option,
  WasmVerifyInfo,
} from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { RemarkOperation } from "lib/types";
import { dateFromNow, formatUTC, getWasmVerifyStatus } from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
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
    bottomContent={
      contractInfo.latestUpdated ? (
        <div>
          <Text variant="body3">{formatUTC(contractInfo.latestUpdated)}</Text>
          <Text color="text.dark" variant="body3">
            {`(${dateFromNow(contractInfo.latestUpdated)})`}
          </Text>
        </div>
      ) : null
    }
    middleContent={
      showLastUpdate && (
        <Flex direction="column" gap={3} w="full">
          <div>
            <MobileLabel label="Contract Name" />
            <Text
              color="text.main"
              maxW="full"
              variant="body2"
              wordBreak="break-all"
            >
              {contractInfo.name ?? contractInfo.label}
            </Text>
          </div>
          <div>
            <InstantiatorRemark remark={contractInfo.remark} />
            <ContractInstantiatorCell
              contractInfo={contractInfo}
              isReadOnly={false}
            />
          </div>
        </Flex>
      )
    }
    topContent={
      <Flex align="center" gap={2}>
        <MobileLabel label="Contract Address" variant="body2" />
        <ExplorerLink
          rightIcon={
            contractInfo.codeId ? (
              <WasmVerifyBadge
                linkedCodeId={contractInfo.codeId}
                relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                status={getWasmVerifyStatus(wasmVerifyInfo)}
              />
            ) : undefined
          }
          type="contract_address"
          value={contractInfo.contractAddress}
        />
      </Flex>
    }
    onClick={() => onRowSelect(contractInfo.contractAddress)}
  />
);
