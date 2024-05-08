import { Flex, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type {
  BechAddr32,
  ContractHistoryRemark,
  ContractInfo,
  Option,
} from "lib/types";
import { RemarkOperation } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { ContractInstantiatorCell } from "./ContractInstantiatorCell";

interface ContractsTableMobileCardProps {
  contractInfo: ContractInfo;
  onRowSelect: (contract: BechAddr32) => void;
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
}: ContractsTableMobileCardProps) => (
  <MobileCardTemplate
    onClick={() => onRowSelect(contractInfo.contractAddress)}
    topContent={
      <Flex gap={2} align="center">
        <MobileLabel variant="body2" label="Contract Address" />
        <ExplorerLink
          value={contractInfo.contractAddress}
          type="contract_address"
        />
      </Flex>
    }
    middleContent={
      <Flex gap={3} direction="column" w="full">
        <div>
          <MobileLabel label="Contract Name" />
          <Text
            variant="body2"
            maxW="full"
            color="text.main"
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
  />
);
