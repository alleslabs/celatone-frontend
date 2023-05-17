import { Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const UploadButton = () => {
  const navigate = useInternalNavigate();
  return (
    <Button
      onClick={() => navigate({ pathname: "/upload" })}
      leftIcon={<CustomIcon name="plus" boxSize="12px" />}
    >
      Upload New Code
    </Button>
  );
};
