import { Button, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { useGetAddressType } from "lib/hooks";
import type { PermissionAddresses } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";

export const ViewPermissionAddresses = ({
  permissionAddresses,
}: {
  permissionAddresses: PermissionAddresses;
}) => {
  const [viewAll, setViewAll] = useState(false);
  const getAddressType = useGetAddressType();
  const showAddressses =
    viewAll ||
    typeof permissionAddresses === "string" ||
    (typeof permissionAddresses === "object" &&
      permissionAddresses.length === 1);

  return (
    <>
      {showAddressses &&
        (typeof permissionAddresses === "string" ? (
          <ExplorerLink
            key={permissionAddresses}
            type={getAddressType(permissionAddresses)}
            value={permissionAddresses}
            canCopyWithHover
          />
        ) : (
          permissionAddresses.map((addr) => {
            return (
              <ExplorerLink
                key={addr}
                type={getAddressType(addr)}
                value={addr}
                canCopyWithHover
              />
            );
          })
        ))}
      {typeof permissionAddresses === "object" &&
        permissionAddresses.length > 1 && (
          <Button
            variant="ghost-primary"
            onClick={() => setViewAll((prev) => !prev)}
            size="sm"
            p="unset"
            w="fit-content"
            rightIcon={
              <Icon
                as={FiChevronDown}
                boxSize={4}
                sx={{ transform: viewAll ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            }
          >
            {viewAll ? "See Less" : "View All Addresses"}
          </Button>
        )}
    </>
  );
};
