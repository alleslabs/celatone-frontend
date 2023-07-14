import { Image } from "@chakra-ui/react";

export const TopDecorations = ({ chain }: { chain: string }) => {
  // Handle dedicated decorations for each chain
  switch (chain) {
    case "osmosis":
    case "sei":
    default:
      return (
        <>
          <Image
            w="700px"
            h="700px"
            position="absolute"
            src="https://assets.alleslabs.dev/illustration/bg-left.svg"
            transform="translateX(-50%) translateY(-47%)"
            zIndex={0}
          />
          <Image
            w="480px"
            h="480px"
            position="absolute"
            src="https://assets.alleslabs.dev/illustration/bg-right.svg"
            right={0}
            bottom={0}
            transform="translateX(40%) translateY(55%)"
            zIndex={0}
          />
        </>
      );
  }
};
