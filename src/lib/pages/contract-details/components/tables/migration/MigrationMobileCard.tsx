import { Flex, Text } from "@chakra-ui/react";

import {
  useGetAddressType,
  useInternalNavigate,
  useTierConfig,
} from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  CodeNameCell,
  MobileCardTemplate,
  MobileLabel,
  RemarkRender,
} from "lib/components/table";
import type { BechAddr, ContractMigrationHistory } from "lib/types";
import { dateFromNow, formatUTC, getCw2Info } from "lib/utils";

interface MigrationMobileCardProps {
  history: ContractMigrationHistory;
}
export const MigrationMobileCard = ({ history }: MigrationMobileCardProps) => {
  const isFullTier = useTierConfig() === "full";
  const getAddressType = useGetAddressType();
  const cw2Info = getCw2Info(history.cw2Contract, history.cw2Version);
  const navigate = useInternalNavigate();
  return (
    <MobileCardTemplate
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
                // TODO: fix by handle uploader undefined
                uploader: history.uploader ?? ("" as BechAddr),
                name: history.codeName,
              }}
            />
          </Flex>
          {isFullTier && history.remark && (
            <>
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
                <RemarkRender {...history.remark} />
              </Flex>
            </>
          )}
        </Flex>
      }
      bottomContent={
        <Flex w="full" direction="column" gap={3}>
          <Flex>
            {isFullTier && history.sender && (
              <Flex flex="1" direction="column">
                <MobileLabel label="Sender" />
                <ExplorerLink
                  type={getAddressType(history.sender)}
                  value={history.sender}
                  textFormat="truncate"
                  showCopyOnHover
                />
              </Flex>
            )}
            <Flex flex="1" direction="column">
              <MobileLabel label="Block Height" />
              {history.height ? (
                <ExplorerLink
                  value={history.height.toString()}
                  type="block_height"
                  showCopyOnHover
                />
              ) : (
                "N/A"
              )}
            </Flex>
          </Flex>
          {isFullTier && history.timestamp && (
            <Flex direction="column">
              <Text variant="body3">{formatUTC(history.timestamp)}</Text>
              <Text variant="body3" color="text.dark">
                ({dateFromNow(history.timestamp)})
              </Text>
            </Flex>
          )}
        </Flex>
      }
    />
  );
};
