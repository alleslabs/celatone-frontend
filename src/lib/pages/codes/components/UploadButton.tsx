import { Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon/CustomIcon";

export default () => {
  const navigate = useInternalNavigate();
  return (
    <Button
      onClick={() => navigate({ pathname: "/upload" })}
      rightIcon={
        <CustomIcon
          name="plus"
          viewBox="-2 -1 16 16"
          color="text.main"
          boxSize="12px"
        />
      }
    >
      Upload New Code
    </Button>
  );
};
