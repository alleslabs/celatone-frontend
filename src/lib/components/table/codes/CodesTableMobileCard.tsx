import { Flex, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { PermissionChip } from "lib/components/PermissionChip";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { CodeInfo, Nullish, WasmVerifyInfo } from "lib/types";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";

interface CodesTableMobileCardProps {
  codeInfo: CodeInfo;
  showCw2andContracts: boolean;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}
export const CodesTableMobileCard = ({
  codeInfo,
  showCw2andContracts,
  wasmVerifyInfo,
}: CodesTableMobileCardProps) => {
  const cw2Info = getCw2Info(codeInfo.cw2Contract, codeInfo.cw2Version);
  const navigate = useInternalNavigate();

  return (
    <MobileCardTemplate
      middleContent={
        showCw2andContracts && (
          <Flex direction="column">
            <MobileLabel label="CW2 Info" />
            <Text
              color={cw2Info ? "text.main" : "text.disabled"}
              onClick={(e) => e.stopPropagation()}
              wordBreak="break-all"
            >
              {cw2Info ?? "N/A"}
            </Text>
          </Flex>
        )
      }
      bottomContent={
        showCw2andContracts && (
          <Flex gap={3} w="full">
            <Flex flex={1} direction="column">
              <MobileLabel label="Contracts" />
              <Text
                variant="body3"
                color={codeInfo.contractCount ? "text.main" : "text.disabled"}
                cursor="text"
                onClick={(e) => e.stopPropagation()}
              >
                {codeInfo.contractCount ?? "N/A"}
              </Text>
            </Flex>
            <Flex flex={1} direction="column">
              <MobileLabel label="Permission" />
              <PermissionChip
                tagSize="xs"
                instantiatePermission={codeInfo.instantiatePermission}
                permissionAddresses={codeInfo.permissionAddresses}
              />
            </Flex>
          </Flex>
        )
      }
      onClick={() =>
        navigate({
          pathname: "/codes/[codeId]",
          query: { codeId: codeInfo.id.toString() },
        })
      }
      topContent={
        showCw2andContracts ? (
          <Flex align="center" gap={2}>
            <MobileLabel label="Code ID" variant="body2" />
            <ExplorerLink
              type="code_id"
              value={codeInfo.id.toString()}
              rightIcon={
                <WasmVerifyBadge
                  status={getWasmVerifyStatus(wasmVerifyInfo)}
                  relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                />
              }
              showCopyOnHover
            />
          </Flex>
        ) : (
          <Flex gap={3} w="full">
            <Flex flex={1} direction="column">
              <MobileLabel label="Code ID" variant="body2" />
              <ExplorerLink
                type="code_id"
                value={codeInfo.id.toString()}
                showCopyOnHover
              />
            </Flex>
            <Flex flex={1} gap={1} direction="column">
              <MobileLabel label="Permission" variant="body2" />
              <PermissionChip
                tagSize="xs"
                instantiatePermission={codeInfo.instantiatePermission}
                permissionAddresses={codeInfo.permissionAddresses}
              />
            </Flex>
          </Flex>
        )
      }
    />
  );
};
