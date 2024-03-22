import { Image } from "@chakra-ui/react";

import { CURR_THEME } from "env";

// TODO: Handle different chains decoration rendering
export const TopDecorations = () =>
  CURR_THEME.illustration.overview.main ? (
    <>
      <Image
        w="700px"
        h="700px"
        position="absolute"
        opacity={0.3}
        src={CURR_THEME.illustration.overview.main}
        transform="translateX(-50%) translateY(-47%)"
        zIndex={0}
      />
      <Image
        w="480px"
        h="480px"
        position="absolute"
        src={CURR_THEME.illustration.overview?.secondary}
        opacity={0.3}
        right={0}
        bottom={0}
        transform="translateX(40%) translateY(55%)"
        zIndex={0}
      />
    </>
  ) : null;
