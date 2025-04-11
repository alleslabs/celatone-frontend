import type { PermissionAddresses } from "lib/types";

import { Button } from "@chakra-ui/react";
import { trackUseExpand } from "lib/amplitude";
import { useGetAddressType } from "lib/app-provider";
import { useState } from "react";

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
            showCopyOnHover
            type={getAddressType(addr)}
            value={addr}
          />
        ))}
      {permissionAddresses.length > 1 && (
        <Button
          px="2 !important"
          rightIcon={
            <CustomIcon
              boxSize={3}
              name={viewAll ? "chevron-up" : "chevron-down"}
            />
          }
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
        >
          {viewAll ? "See less" : "View all addresses"}
        </Button>
      )}
    </>
  );
};
