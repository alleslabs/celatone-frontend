import { Button, Flex, Text } from "@chakra-ui/react";

export interface ButtonProps {
  label: string;
  action: () => void;
  variant: string;
  isDisabled?: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}

export interface FooterBodyProps {
  leftButtonProps: ButtonProps;
  rightButtonProps: ButtonProps;
}

export const CustomNetworkFooterCtaBody = ({
  leftButtonProps,
  rightButtonProps,
}: FooterBodyProps) => (
  <Flex direction="column" w="full">
    <Flex align="center" justify="space-between" w="full">
      <Button
        minW="128px"
        onClick={leftButtonProps.action}
        isDisabled={leftButtonProps.isDisabled}
        variant={leftButtonProps.variant}
        leftIcon={leftButtonProps.leftIcon}
      >
        {leftButtonProps.label}
      </Button>
      <Button
        minW="128px"
        onClick={rightButtonProps.action}
        rightIcon={rightButtonProps.rightIcon}
        isDisabled={rightButtonProps.isDisabled}
        variant={rightButtonProps.variant}
      >
        {rightButtonProps.label}
      </Button>
    </Flex>
    <Text variant="body2" color="text.dark" textAlign="center" mt={4}>
      The added custom Minitia on Initiascan will be stored locally on your
      device.
    </Text>
  </Flex>
);
