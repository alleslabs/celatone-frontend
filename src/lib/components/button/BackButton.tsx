import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { CustomIcon } from "../icon";
import { AmpEvent, useTrack } from "lib/amplitude";

export const BackButton = (props: ButtonProps) => {
  const router = useRouter();
  const { track } = useTrack();

  return (
    <Button
      variant="ghost-secondary"
      size="sm"
      mb={2}
      p="unset"
      pr={2}
      onClick={() => {
        track(AmpEvent.USE_BACK_BUTTON);
        router.back();
      }}
      {...props}
    >
      <CustomIcon name="chevron-left" boxSize={3} mr={2} />
      BACK
    </Button>
  );
};
