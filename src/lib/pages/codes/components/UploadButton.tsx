import { Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export default () => {
  const navigate = useInternalNavigate();
  return (
    <Button
      onClick={() => navigate({ pathname: "/upload" })}
      leftIcon={<CustomIcon name="plus" color="text.main" boxSize="12px" />}
    >
      Upload New Code
    </Button>
  );
};
