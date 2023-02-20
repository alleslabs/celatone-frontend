import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

export const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost-primary"
      size="sm"
      mb="8px"
      onClick={() => {
        AmpTrack(AmpEvent.USE_BACK_BUTTON);
        router.back();
      }}
      leftIcon={<ArrowBackIcon boxSize={4} />}
    >
      BACK
    </Button>
  );
};
