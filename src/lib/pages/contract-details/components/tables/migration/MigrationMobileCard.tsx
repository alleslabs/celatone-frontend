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
import type {
  BechAddr,
  ContractMigrationHistory,
  Nullish,
  WasmVerifyInfo,
} from "lib/types";
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
      middleContent={
        <Flex gap={3} direction="column">
          <Flex direction="column">
            <MobileLabel label="Code Name" variant="body3" />
            <CodeNameCell
              code={{
                id: history.codeId,
                name: history.codeName,
                // TODO: fix by handle uploader undefined
                uploader: history.uploader ?? ("" as BechAddr),
              }}
            />
          </Flex>
          {isFullTier && (
            <>
              <Flex direction="column">
                <MobileLabel label="CW2 Info" variant="body3" />
                <Text
                  variant="body2"
                  color={cw2Info ? "text.main" : "text.disabled"}
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
        <Flex gap={3} w="full" direction="column">
          <Flex>
            {isFullTier && (
              <Flex flex={1} direction="column">
                <MobileLabel label="Sender" />
                {history.sender ? (
                  <ExplorerLink
                    type={getAddressType(history.sender)}
                    value={history.sender}
                    showCopyOnHover
                    textFormat="truncate"
                  />
                ) : (
                  "N/A"
                )}
              </Flex>
            )}
            <Flex flex={1} direction="column">
              <MobileLabel label="Block Height" />
              {history.height ? (
                <ExplorerLink
                  type="block_height"
                  value={history.height.toString()}
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
      onClick={() =>
        navigate({
          pathname: "/codes/[codeId]",
          query: { codeId: history.codeId.toString() },
        })
      }
      topContent={
        <Flex w="full">
          <Flex align="center" flex={1} gap={2}>
            <MobileLabel label="Code ID" variant="body2" />
            <ExplorerLink
              type="code_id"
              value={history.codeId.toString()}
              rightIcon={
                <WasmVerifyBadge
                  status={getWasmVerifyStatus(wasmVerifyInfo)}
                  relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                />
              }
              showCopyOnHover
            />
          </Flex>
        </Flex>
      }
    />
  );
};
