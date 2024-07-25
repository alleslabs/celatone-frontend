import { Box, Flex, Grid } from "@chakra-ui/react";

import type {
  ButtonProps,
  FooterBodyProps,
} from "./CustomNetworkFooterCtaBody";
import { CustomNetworkFooterCtaBody } from "./CustomNetworkFooterCtaBody";

interface CustomNetworkFooterCtaProps extends FooterBodyProps {
  isCenterAlign?: boolean;
  leftButtonProps: ButtonProps;
  rightButtonProps: ButtonProps;
}

export const CustomNetworkFooterCta = ({
  leftButtonProps,
  rightButtonProps,
  isCenterAlign = true,
}: CustomNetworkFooterCtaProps) => (
  <Box
    w="full"
    minH="70px"
    background="background.main"
    bottom="0"
    borderTop="1px solid"
    borderColor="gray.700"
    position="sticky"
    zIndex={2}
    id="footer-cta"
  >
    {isCenterAlign ? (
      <Flex
        w={640}
        h="full"
        mx="auto"
        direction="column"
        align="center"
        py={4}
        gap={2}
      >
        <CustomNetworkFooterCtaBody
          leftButtonProps={leftButtonProps}
          rightButtonProps={rightButtonProps}
        />
      </Flex>
    ) : (
      <Flex w={900} align="center" direction="column" mx="auto" minH="inherit">
        <Grid templateColumns="2fr 5fr" w="full" gap={16} py={4} px={8}>
          <div />
          <CustomNetworkFooterCtaBody
            leftButtonProps={leftButtonProps}
            rightButtonProps={rightButtonProps}
          />
        </Grid>
      </Flex>
    )}
  </Box>
);
