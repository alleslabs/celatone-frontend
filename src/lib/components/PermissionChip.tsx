import { Flex, Tag } from "@chakra-ui/react";

import { useCurrentChain, useMobile } from "lib/app-provider";
import type {
  HumanAddr,
  PermissionAddresses,
  AccessConfigPermission,
} from "lib/types";
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
    address as HumanAddr,
    instantiatePermission,
    permissionAddresses
  );

  const { message } = getPermissionHelper(
    address as HumanAddr,
    instantiatePermission,
    permissionAddresses
  );
  const isMobile = useMobile();
  return isMobile ? (
    <Tooltip label={message} placement="top-start">
      <Flex w="fit-content">
        <Tag size={tagSize} variant={isAllowed ? "accent-darker" : "gray"}>
          {instantiatePermission}
        </Tag>
      </Flex>
    </Tooltip>
  ) : (
    <Tooltip label={message} placement="top-start">
      <Flex onClick={(e) => e.stopPropagation()} w="fit-content">
        <Tag size={tagSize} variant={isAllowed ? "accent-darker" : "gray"}>
          {instantiatePermission}
        </Tag>
      </Flex>
    </Tooltip>
  );
};
