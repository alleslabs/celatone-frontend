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
      middleContent={
        <Flex gap={3} direction="column">
          <Flex direction="column">
            <MobileLabel label="Code Name" />
            <Text>{publicInfo.name}</Text>
          </Flex>
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
        </Flex>
      }
      bottomContent={
        <Flex gap={3} w="full">
          <Flex flex={1} direction="column">
            <MobileLabel label="Contracts" />
            <Text
              variant="body3"
              color={publicInfo.contractCount ? "text.main" : "text.disabled"}
              cursor="text"
              onClick={(e) => e.stopPropagation()}
            >
              {publicInfo.contractCount ?? "N/A"}
            </Text>
          </Flex>
          <Flex flex={1} direction="column">
            <MobileLabel label="Permission" />
            <PermissionChip
              tagSize="xs"
              instantiatePermission={publicInfo.instantiatePermission}
              permissionAddresses={publicInfo.permissionAddresses}
            />
          </Flex>
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/codes/[codeId]",
          query: { codeId: publicInfo.id.toString() },
        })
      }
      topContent={
        <Flex align="center" gap={2}>
          <MobileLabel label="Code ID" variant="body2" />
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
    />
  );
};
