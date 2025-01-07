import type { TabProps } from "@chakra-ui/react";
import {
  Badge,
  Button,
  Skeleton,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";

import type { Nullish } from "lib/types";

interface CustomTabProps extends TabProps {
  count?: Nullish<number>;
  fallbackValue?: string;
  isLoading?: boolean;
}

export const CustomTab = ({
  count,
  fallbackValue = "N/A",
  isDisabled,
  isLoading,
  ...restProps
}: CustomTabProps) => {
  const tabProps = useTab({ ...restProps });
  const isSelected = tabProps["aria-selected"];
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      _active={{
        bg: "unset",
      }}
      alignItems="center"
      display="flex"
      isDisabled={isDisabled}
      letterSpacing="0.4px"
      lineHeight="24px"
      mb={0}
      minW="fit-content"
      sx={{
        "&[aria-selected=false]": {
          color: "gray.500",
        },
        "&[aria-selected=true]": {
          color: "primary.light",
        },
      }}
      variant="ghost-gray"
      fontSize="14px"
      fontWeight={700}
      {...tabProps}
    >
      {tabProps.children}

      {isLoading ? (
        <Skeleton
          h={4}
          ml={2}
          w={8}
          borderRadius={8}
          endColor="gray.700"
          startColor="gray.500"
        />
      ) : (
        count !== undefined && (
          <Badge ml={2} variant={isSelected ? "primary" : "gray"}>
            {count === null ? fallbackValue : count}
          </Badge>
        )
      )}
    </Button>
  );
};
