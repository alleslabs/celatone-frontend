import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface FooterBodyProps {
  currentStep?: number;
  totalSteps?: number;
  leftButtonLabel?: string;
  leftButtonAction: () => void;
  rightButtonLabel?: string;
  rightButtonAction: () => void;
}

interface CustomNetworkFooterCtaProps extends FooterBodyProps {
  isCenterAlign?: boolean;
}

const FooterBody = ({
  currentStep,
  totalSteps,
  leftButtonAction,
  leftButtonLabel = "Previous",
  rightButtonAction,
  rightButtonLabel = "Next",
}: FooterBodyProps) => (
  <Flex direction="column">
    <Flex align="center" justify="space-between" w="full">
      <Button
        minW="128px"
        onClick={rightButtonAction}
        isDisabled={currentStep === 0}
      >
        {leftButtonLabel}
      </Button>
      <Button
        minW="128px"
        pr={1}
        onClick={leftButtonAction}
        rightIcon={<CustomIcon name="chevron-right" />}
        isDisabled={currentStep === (totalSteps ?? 0) - 1}
      >
        {rightButtonLabel}
      </Button>
    </Flex>
    <Text variant="body2" color="text.dark" textAlign="center" mt={4}>
      The added custom Minitia on Initiascan will be stored locally on your
      device.
    </Text>
  </Flex>
);

export const CustomNetworkFooterCta = ({
  currentStep,
  totalSteps,
  leftButtonAction,
  leftButtonLabel,
  rightButtonAction,
  rightButtonLabel,
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
        <FooterBody
          currentStep={currentStep}
          totalSteps={totalSteps}
          leftButtonLabel={leftButtonLabel}
          leftButtonAction={leftButtonAction}
          rightButtonLabel={rightButtonLabel}
          rightButtonAction={rightButtonAction}
        />
      </Flex>
    ) : (
      <Flex w={900} align="center" direction="column" mx="auto" minH="inherit">
        <Grid templateColumns="2fr 5fr" w="full" gap={16} py={4} px={8}>
          <div />
          <FooterBody
            currentStep={currentStep}
            totalSteps={totalSteps}
            leftButtonLabel={leftButtonLabel}
            leftButtonAction={leftButtonAction}
            rightButtonLabel={rightButtonLabel}
            rightButtonAction={rightButtonAction}
          />
        </Grid>
      </Flex>
    )}
  </Box>
);
