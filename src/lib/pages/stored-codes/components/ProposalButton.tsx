import { Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const ProposalButton = () => {
  const navigate = useInternalNavigate();
  return (
    <Button
      variant="outline-primary"
      onClick={() => navigate({ pathname: "/proposals/store-code" })}
      rightIcon={
        <CustomIcon
          name="submit-proposal"
          color="primary.light"
          boxSize="12px"
        />
      }
    >
      Propose to store code
    </Button>
  );
};
