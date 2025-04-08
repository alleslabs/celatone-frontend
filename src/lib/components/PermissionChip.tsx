import type { AccessConfigPermission, PermissionAddresses } from "lib/types";

import { Flex, Tag } from "@chakra-ui/react";
import { useCurrentChain } from "lib/app-provider";
import { getPermissionHelper, resolvePermission } from "lib/utils";

import { Tooltip } from "./Tooltip";

interface PermissionChipProps {
  instantiatePermission: AccessConfigPermission;
  permissionAddresses: PermissionAddresses;
  tagSize?: string;
}

export const PermissionChip = ({
  instantiatePermission,
  permissionAddresses,
  tagSize = "md",
}: PermissionChipProps) => {
  const { address } = useCurrentChain();

  const isAllowed = resolvePermission(
    address,
    instantiatePermission,
    permissionAddresses
  );

  const { message } = getPermissionHelper(
    address,
    instantiatePermission,
    permissionAddresses
  );

  return (
    <Tooltip label={message}>
      <Flex w="fit-content" onClick={(e) => e.stopPropagation()}>
        <Tag size={tagSize} variant={isAllowed ? "primary-darker" : "gray"}>
          {instantiatePermission}
        </Tag>
      </Flex>
    </Tooltip>
  );
};
