import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { PermissionChip } from "lib/components/PermissionChip";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { CodeInfo, Nullish, WasmVerifyInfo } from "lib/types";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";
import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

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
      onClick={() =>
        navigate({
          pathname: "/codes/[codeId]",
          query: { codeId: codeInfo.id.toString() },
        })
      }
      topContent={
        showCw2andContracts ? (
          <Flex gap={2} align="center">
            <MobileLabel variant="body2" label="Code ID" />
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
            <Flex direction="column" flex={1}>
              <MobileLabel variant="body2" label="Code ID" />
              <ExplorerLink
                type="code_id"
                value={codeInfo.id.toString()}
                showCopyOnHover
              />
            </Flex>
            <Flex direction="column" flex={1} gap={1}>
              <MobileLabel variant="body2" label="Permission" />
              <PermissionChip
                instantiatePermission={codeInfo.instantiatePermission}
                permissionAddresses={codeInfo.permissionAddresses}
                tagSize="xs"
              />
            </Flex>
          </Flex>
        )
      }
      middleContent={
        showCw2andContracts && (
          <Flex direction="column">
            <MobileLabel label="CW2 Info" />
            <Text
              color={cw2Info ? "text.main" : "text.disabled"}
              wordBreak="break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {cw2Info ?? "N/A"}
            </Text>
          </Flex>
        )
      }
      bottomContent={
        showCw2andContracts && (
          <Flex gap={3} w="full">
            <Flex direction="column" flex={1}>
              <MobileLabel label="Contracts" />
              <Text
                variant="body3"
                onClick={(e) => e.stopPropagation()}
                cursor="text"
                color={codeInfo.contractCount ? "text.main" : "text.disabled"}
              >
                {codeInfo.contractCount ?? "N/A"}
              </Text>
            </Flex>
            <Flex direction="column" flex={1}>
              <MobileLabel label="Permission" />
              <PermissionChip
                instantiatePermission={codeInfo.instantiatePermission}
                permissionAddresses={codeInfo.permissionAddresses}
                tagSize="xs"
              />
            </Flex>
          </Flex>
        )
      }
    />
  );
};
