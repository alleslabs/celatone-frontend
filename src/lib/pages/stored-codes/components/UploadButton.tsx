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
      hidden={isAllowed}
      label="Only allowed address can upload Wasm file without opening proposal"
    >
      <Button
        isDisabled={!isAllowed}
        rightIcon={<CustomIcon boxSize="12px" name="upload" />}
        onClick={() => navigate({ pathname: "/upload" })}
      >
        Upload new code
      </Button>
    </Tooltip>
  );
};
