import { Button } from "@chakra-ui/react";
import { useState } from "react";

import { useGetAddressType } from "lib/app-provider";
import type { PermissionAddresses } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";

export const ViewPermissionAddresses = ({
  permissionAddresses,
}: {
  permissionAddresses: PermissionAddresses;
}) => {
  const [viewAll, setViewAll] = useState(false);
  const getAddressType = useGetAddressType();
  const showAddressses =
    viewAll ||
    (typeof permissionAddresses === "object" &&
      permissionAddresses.length === 1);

  return (
    <>
      {showAddressses &&
        permissionAddresses.map((addr) => {
          return (
            <ExplorerLink
              key={addr}
              type={getAddressType(addr)}
              value={addr}
              canCopyWithHover
            />
          );
        })}
      {permissionAddresses.length > 1 && (
        <Button
          variant="ghost-primary"
          onClick={() => setViewAll((prev) => !prev)}
          size="sm"
          p="unset"
          w="fit-content"
          rightIcon={
            <CustomIcon
              name={viewAll ? "chevron-up" : "chevron-down"}
              color="lilac.main"
              boxSize="3"
            />
          }
        >
          {viewAll ? "See Less" : "View All Addresses"}
        </Button>
      )}
    </>
  );
};
