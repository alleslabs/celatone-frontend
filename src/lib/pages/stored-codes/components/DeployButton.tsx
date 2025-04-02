import { Button } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const DeployButton = () => {
  const navigate = useInternalNavigate();
  return (
    <Button
      rightIcon={<CustomIcon boxSize="12px" color="text.main" name="plus" />}
      onClick={() => navigate({ pathname: "/deploy" })}
    >
      Deploy New Contract
    </Button>
  );
};
