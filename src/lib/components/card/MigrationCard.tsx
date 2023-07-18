import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { CodeNameCell } from "../table";
import { useGetAddressType, useInternalNavigate } from "lib/app-provider";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import { RemarkRender } from "lib/pages/contract-details/components/tables/migration/MigrationRow";
import type { ContractMigrationHistory } from "lib/types";
import { dateFromNow, formatUTC, getCw2Info } from "lib/utils";

import { DefaultMobileCard } from "./DefaultMobileCard";

interface MigrationCardProps {
  history: ContractMigrationHistory;
}
export const MigrationCard = ({ history }: MigrationCardProps) => {
  const getAddressType = useGetAddressType();
  const cw2Info = getCw2Info(history.cw2Contract, history.cw2Version);
  const navigate = useInternalNavigate();
  return (
    <DefaultMobileCard
      onClick={() =>
        navigate({
          pathname: "/codes/[codeId]",
          query: { codeId: history.codeId.toString() },
        })
      }
      topContent={
        <Flex w="full">
          <Flex flex="1" gap={2} align="center">
            <MobileLabel label="Code ID" variant="body2" />
            <ExplorerLink
              type="code_id"
              value={history.codeId.toString()}
              showCopyOnHover
            />
          </Flex>
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel variant="body3" label="Code Name" />
            <CodeNameCell
              code={{
                id: history.codeId,
                uploader: history.uploader,
                name: history.codeName,
              }}
            />
          </Flex>
          <Flex direction="column">
            <MobileLabel variant="body3" label="CW2 Info" />
            <Text
              variant="body2"
              color={cw2Info ? "text.main" : "text.disabled"}
              wordBreak="break-all"
            >
              {cw2Info ?? "N/A"}
            </Text>
          </Flex>
          <Flex direction="column">
            <MobileLabel variant="body3" label="Remark" />
            <RemarkRender remark={history.remark} />
          </Flex>
        </Flex>
      }
      bottomContent={
        <Flex w="full" direction="column" gap={3}>
          <Flex>
            <Flex flex="1" direction="column">
              <MobileLabel label="Sender" />
              <ExplorerLink
                type={getAddressType(history.sender)}
                value={history.sender}
                textFormat="truncate"
                showCopyOnHover
              />
            </Flex>
            <Flex flex="1" direction="column">
              <MobileLabel label="Block Height" />
              <ExplorerLink
                value={history.height.toString()}
                type="block_height"
                showCopyOnHover
              />
            </Flex>
          </Flex>
          <Flex direction="column">
            <Text variant="body3">{formatUTC(history.timestamp)}</Text>
            <Text variant="body3" color="text.dark">
              ({dateFromNow(history.timestamp)})
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
