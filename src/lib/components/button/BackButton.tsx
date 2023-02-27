import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { CustomIcon } from "../icon/CustomIcon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

export const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost-primary"
      size="sm"
      mb="8px"
      p="unset"
      pr="2"
      onClick={() => {
        AmpTrack(AmpEvent.USE_BACK_BUTTON);
        router.back();
      }}
    >
      <CustomIcon name="chevron-left" color="lilac.main" boxSize="3" />
      BACK
    </Button>
  );
};
