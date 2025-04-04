import { Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

interface UploadButtonProps {
  isAllowed: boolean;
}
export const UploadButton = ({ isAllowed }: UploadButtonProps) => {
  const navigate = useInternalNavigate();

  return (
    <Tooltip
      label="Only allowed address can upload Wasm file without opening proposal"
      hidden={isAllowed}
    >
      <Button
        isDisabled={!isAllowed}
        onClick={() => navigate({ pathname: "/upload" })}
        rightIcon={<CustomIcon name="upload" boxSize="12px" />}
      >
        Upload new code
      </Button>
    </Tooltip>
  );
};
