import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { PermissionChip } from "lib/components/PermissionChip";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { Nullish, WasmVerifyInfo } from "lib/types";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";

import type { PublicCodeInfo } from ".";

interface PublicProjectCodeMobileCardProps {
  publicCodeInfo: PublicCodeInfo;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}
export const PublicProjectCodeMobileCard = ({
  publicCodeInfo: { publicInfo },
  wasmVerifyInfo,
}: PublicProjectCodeMobileCardProps) => {
  const cw2Info = getCw2Info(publicInfo.cw2Contract, publicInfo.cw2Version);
  const navigate = useInternalNavigate();

  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/codes/[codeId]",
          query: { codeId: publicInfo.id.toString() },
        })
      }
      topContent={
        <Flex gap={2} align="center">
          <MobileLabel variant="body2" label="Code ID" />
          <ExplorerLink
            type="code_id"
            value={publicInfo.id.toString()}
            rightIcon={
              <WasmVerifyBadge
                status={getWasmVerifyStatus(wasmVerifyInfo)}
                relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              />
            }
            showCopyOnHover
          />
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="Code name" />
            <Text>{publicInfo.name}</Text>
          </Flex>
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
        </Flex>
      }
      bottomContent={
        <Flex gap={3} w="full">
          <Flex direction="column" flex={1}>
            <MobileLabel label="Contracts" />
            <Text
              variant="body3"
              onClick={(e) => e.stopPropagation()}
              cursor="text"
              color={publicInfo.contractCount ? "text.main" : "text.disabled"}
            >
              {publicInfo.contractCount ?? "N/A"}
            </Text>
          </Flex>
          <Flex direction="column" flex={1}>
            <MobileLabel label="Permission" />
            <PermissionChip
              instantiatePermission={publicInfo.instantiatePermission}
              permissionAddresses={publicInfo.permissionAddresses}
              tagSize="xs"
            />
          </Flex>
        </Flex>
      }
    />
  );
};
