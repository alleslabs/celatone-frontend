import type { TabProps } from "@chakra-ui/react";
import {
  Button,
  useTab,
  Text,
  useMultiStyleConfig,
  Flex,
} from "@chakra-ui/react";

import type { Nullish } from "lib/types";

interface CustomTabProps extends TabProps {
  count?: Nullish<number | string>;
  isLoading?: boolean;
  title: string;
  description: string;
  step: number;
}

export const VoteDetailTab = ({
  count,
  isLoading,
  title,
  description,
  step,
  ...restProps
}: CustomTabProps) => {
  const tabProps = useTab({ ...restProps });
  const isSelected = tabProps["aria-selected"];
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      display="flex"
      w="full"
      alignItems="center"
      fontSize="14px"
      fontWeight={700}
      lineHeight="24px"
      letterSpacing="0.4px"
      variant="ghost-gray"
      mb={0}
      py={3}
      borderRadius="8px 8px 0px 0px"
      sx={{
        "&[aria-selected=true]": {
          background: "gray.800",
          border: "1px solid",
          borderColor: "gray.700",
          opacity: "100%",
          borderBottomColor: "transparent",
        },
        "&[aria-selected=false]": {
          background: "transparent",
          border: "1px solid",
          borderColor: "gray.700",
          opacity: "70%",
          borderBottomColor: "transparent",
        },
      }}
      _active={{
        bg: "unset",
      }}
      {...tabProps}
    >
      <Flex justifyContent="space-between" w="full" alignItems="flex-start">
        <Flex gap={2}>
          <Flex
            borderRadius="32px"
            w={6}
            h={6}
            alignItems="center"
            justifyContent="center"
            background={isSelected ? "primary.main" : "gray.500"}
            color={isSelected ? "text.main" : "background.main"}
            fontWeight={isSelected ? 600 : 400}
          >
            {step}
          </Flex>
          <Flex direction="column" alignItems="flex-start">
            <Text variant="body1" color="text.main" fontWeight={600}>
              {title}
            </Text>
            <Text variant="body3" color="text.dark">
              {description}
            </Text>
          </Flex>
        </Flex>
        <Flex
          alignItems="center"
          gap={2}
          background="gray.900"
          borderRadius="8px"
          px={2}
        >
          <Flex h={3} w={3} background="gray.600" borderRadius="24px" />
          <Text variant="body3" color="text.main">
            Waiting For Deposit
          </Text>
        </Flex>
      </Flex>
    </Button>
  );
};
