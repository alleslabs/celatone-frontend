import { Flex, Tag } from "@chakra-ui/react";

import { useCurrentChain } from "lib/app-provider";
import type { PermissionAddresses, AccessConfigPermission } from "lib/types";
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
      <Flex onClick={(e) => e.stopPropagation()} w="fit-content">
        <Tag size={tagSize} variant={isAllowed ? "accent-darker" : "gray"}>
          {instantiatePermission}
        </Tag>
      </Flex>
    </Tooltip>
  );
};
