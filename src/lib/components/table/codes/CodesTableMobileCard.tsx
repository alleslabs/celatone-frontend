import { Flex, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { PermissionChip } from "lib/components/PermissionChip";
import type { CodeInfo } from "lib/types";
import { getCw2Info } from "lib/utils";

import { CodeNameCell } from "./CodeNameCell";

interface CodesTableMobileCardProps {
  codeInfo: CodeInfo;
  showCw2andContracts: boolean;
}
export const CodesTableMobileCard = ({
  codeInfo,
  showCw2andContracts,
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
        <Flex gap={2} align="center">
          <MobileLabel variant="body2" label="Code ID" />
          <ExplorerLink
            type="code_id"
            value={codeInfo.id.toString()}
            showCopyOnHover
          />
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="Code Name" />
            <CodeNameCell code={codeInfo} isReadOnly />
          </Flex>
          {showCw2andContracts && (
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
          )}
        </Flex>
      }
      bottomContent={
        <Flex gap={3} w="full">
          {showCw2andContracts && (
            <Flex direction="column" flex="1">
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
          )}
          <Flex direction="column" flex="1">
            <MobileLabel label="Permission" />
            <PermissionChip
              instantiatePermission={codeInfo.instantiatePermission}
              permissionAddresses={codeInfo.permissionAddresses}
              tagSize="xs"
            />
          </Flex>
        </Flex>
      }
    />
  );
};
