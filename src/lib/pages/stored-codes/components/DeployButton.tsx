import { Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const DeployButton = () => {
  const navigate = useInternalNavigate();
  return (
    <Button
      onClick={() => navigate({ pathname: "/deploy" })}
      rightIcon={<CustomIcon name="plus" boxSize="12px" color="text.main" />}
    >
      Deploy New Contract
    </Button>
  );
};
