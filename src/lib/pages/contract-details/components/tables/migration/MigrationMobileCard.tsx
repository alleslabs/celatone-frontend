import type {
  BechAddr,
  ContractMigrationHistory,
  Nullish,
  WasmVerifyInfo,
} from "lib/types";

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
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import {
  dateFromNow,
  formatUTC,
  getCw2Info,
  getWasmVerifyStatus,
} from "lib/utils";

interface MigrationMobileCardProps {
  history: ContractMigrationHistory;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}
export const MigrationMobileCard = ({
  history,
  wasmVerifyInfo,
}: MigrationMobileCardProps) => {
  const { isFullTier } = useTierConfig();
  const getAddressType = useGetAddressType();
  const cw2Info = getCw2Info(history.cw2Contract, history.cw2Version);
  const navigate = useInternalNavigate();
  return (
    <MobileCardTemplate
      bottomContent={
        <Flex direction="column" gap={3} w="full">
          <Flex>
            {isFullTier && (
              <Flex direction="column" flex={1}>
                <MobileLabel label="Sender" />
                {history.sender ? (
                  <ExplorerLink
                    showCopyOnHover
                    textFormat="truncate"
                    type={getAddressType(history.sender)}
                    value={history.sender}
                  />
                ) : (
                  "N/A"
                )}
              </Flex>
            )}
            <Flex direction="column" flex={1}>
              <MobileLabel label="Block Height" />
              {history.height ? (
                <ExplorerLink
                  showCopyOnHover
                  type="block_height"
                  value={history.height.toString()}
                />
              ) : (
                "N/A"
              )}
            </Flex>
          </Flex>
          {isFullTier && history.timestamp && (
            <Flex direction="column">
              <Text variant="body3">{formatUTC(history.timestamp)}</Text>
              <Text color="text.dark" variant="body3">
                ({dateFromNow(history.timestamp)})
              </Text>
            </Flex>
          )}
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel variant="body3" label="Code name" />
            <CodeNameCell
              code={{
                id: history.codeId,
                // TODO: fix by handle uploader undefined
                uploader: history.uploader ?? ("" as BechAddr),
                name: history.codeName,
              }}
            />
          </Flex>
          {isFullTier && (
            <>
              <Flex direction="column">
                <MobileLabel variant="body3" label="CW2 info" />
                <Text
                  color={cw2Info ? "text.main" : "text.disabled"}
                  variant="body2"
                  wordBreak="break-all"
                >
                  {cw2Info ?? "N/A"}
                </Text>
              </Flex>
              <Flex direction="column">
                <MobileLabel label="Remark" variant="body3" />
                {history.remark ? <RemarkRender {...history.remark} /> : "N/A"}
              </Flex>
            </>
          )}
        </Flex>
      }
      bottomContent={
        <Flex w="full" direction="column" gap={3}>
          <Flex>
            {isFullTier && (
              <Flex flex={1} direction="column">
                <MobileLabel label="Sender" />
                {history.sender ? (
                  <ExplorerLink
                    type={getAddressType(history.sender)}
                    value={history.sender}
                    textFormat="truncate"
                    showCopyOnHover
                  />
                ) : (
                  "N/A"
                )}
              </Flex>
            )}
            <Flex flex={1} direction="column">
              <MobileLabel label="Block height" />
              {history.height ? (
                <ExplorerLink
                  value={history.height.toString()}
                  type="block_height"
                  showCopyOnHover
                />
              }
              showCopyOnHover
              type="code_id"
              value={history.codeId.toString()}
            />
          </Flex>
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/codes/[codeId]",
          query: { codeId: history.codeId.toString() },
        })
      }
    />
  );
};
