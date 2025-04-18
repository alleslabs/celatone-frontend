import type { ButtonProps } from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useRouter } from "next/router";

import { CustomIcon } from "../icon";

export const BackButton = (props: ButtonProps) => {
  const router = useRouter();

  return (
    <Button
      mb={2}
      p="unset"
      pr={2}
      size="sm"
      variant="ghost-primary"
      onClick={() => {
        track(AmpEvent.USE_BACK_BUTTON);
        router.back();
      }}
      {...props}
    >
      <CustomIcon boxSize={3} mr={2} name="chevron-left" />
      BACK
    </Button>
  );
};
