import { Button } from "@chakra-ui/react";
import { useState } from "react";

import { trackUseExpand } from "lib/amplitude";
import { useGetAddressType } from "lib/app-provider";
import type { PermissionAddresses } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";

export const ViewPermissionAddresses = ({
  amptrackSection,
  permissionAddresses,
}: {
  amptrackSection: string;
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
          px="2 !important"
          size="sm"
          variant="ghost-primary"
          w="fit-content"
          onClick={() => {
            trackUseExpand({
              action: viewAll ? "collapse" : "expand",
              component: "permission_address",
              section: amptrackSection,
            });
            setViewAll((prev) => !prev);
          }}
          rightIcon={
            <CustomIcon
              name={viewAll ? "chevron-up" : "chevron-down"}
              boxSize={3}
            />
          }
        >
          {viewAll ? "See Less" : "View All Addresses"}
        </Button>
      )}
    </>
  );
};
