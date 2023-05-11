import { Button, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useGovParams } from "lib/services/proposalService";
import type { Addr } from "lib/types";

export const UploadButton = () => {
  const { address = "" } = useWallet();
  const navigate = useInternalNavigate();
  const { data: govParams } = useGovParams();
  const isAllowed = Boolean(
    govParams?.uploadAccess?.addresses?.includes(address as Addr)
  );

  return (
    <Tooltip
      hasArrow
      label="Only allowed address can upload Wasm file without opening proposal"
      placement="top"
      arrowSize={8}
      bg="honeydew.darker"
      isDisabled={isAllowed}
    >
      <Button
        disabled={!isAllowed}
        onClick={() => navigate({ pathname: "/upload" })}
        rightIcon={
          <CustomIcon
            name="upload"
            color={!isAllowed ? "pebble.600" : "text.main"}
            boxSize="12px"
          />
        }
      >
        Upload New Code
      </Button>
    </Tooltip>
  );
};
