import { Button } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const ProposalButton = () => {
  const navigate = useInternalNavigate();
  return (
    <Button
      rightIcon={
        <CustomIcon
          boxSize="12px"
          color="primary.light"
          name="submit-proposal"
        />
      }
      variant="outline-primary"
      onClick={() => navigate({ pathname: "/proposals/store-code" })}
    >
      Propose to store code
    </Button>
  );
};
