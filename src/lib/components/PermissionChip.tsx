import { Flex, Tag } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import type { HumanAddr, PermissionAddresses } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { getPermissionHelper } from "lib/utils";

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
  const { address } = useWallet();

  const isAllowed =
    permissionAddresses.includes(address as HumanAddr) ||
    instantiatePermission === AccessConfigPermission.EVERYBODY;

  const { message } = getPermissionHelper(
    address as HumanAddr,
    instantiatePermission,
    permissionAddresses
  );

  return (
    <Tooltip label={message}>
      <Flex>
        <Tag size={tagSize} variant={isAllowed ? "accent-darker" : "gray"}>
          {instantiatePermission}
        </Tag>
      </Flex>
    </Tooltip>
  );
};
