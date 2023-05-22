import { Button } from "@chakra-ui/react";
import { useState } from "react";

import { useGetAddressType } from "lib/app-provider";
import { AmpTrackExpand } from "lib/services/amplitude";
import type { PermissionAddresses } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";

export const ViewPermissionAddresses = ({
  permissionAddresses,
  amptrackSection,
}: {
  permissionAddresses: PermissionAddresses;
  amptrackSection: string;
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
        permissionAddresses.map((addr) => (
          <ExplorerLink
            key={addr}
            type={getAddressType(addr)}
            value={addr}
            showCopyOnHover
          />
        ))}
      {permissionAddresses.length > 1 && (
        <Button
          variant="ghost-secondary"
          onClick={() => {
            AmpTrackExpand(
              viewAll ? "collapse" : "expand",
              "permission_address",
              amptrackSection
            );
            setViewAll((prev) => !prev);
          }}
          size="sm"
          px="2 !important"
          w="fit-content"
          rightIcon={
            <CustomIcon
              name={viewAll ? "chevron-up" : "chevron-down"}
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
