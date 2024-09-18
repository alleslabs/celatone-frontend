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
  isLoading?: boolean;
  fallbackValue?: string;
}

export const CustomTab = ({
  count,
  isLoading,
  isDisabled,
  fallbackValue = "N/A",
  ...restProps
}: CustomTabProps) => {
  const tabProps = useTab({ ...restProps });
  const isSelected = tabProps["aria-selected"];
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      display="flex"
      alignItems="center"
      fontSize="14px"
      fontWeight={700}
      lineHeight="24px"
      letterSpacing="0.4px"
      variant="ghost-gray"
      minW="fit-content"
      mb={0}
      sx={{
        "&[aria-selected=true]": {
          color: "primary.light",
        },
        "&[aria-selected=false]": {
          color: "gray.500",
        },
      }}
      isDisabled={isDisabled}
      _active={{
        bg: "unset",
      }}
      {...tabProps}
    >
      {tabProps.children}

      {isLoading ? (
        <Skeleton
          ml={2}
          h={4}
          w={8}
          borderRadius={8}
          startColor="gray.500"
          endColor="gray.700"
        />
      ) : (
        count !== undefined && (
          <Badge variant={isSelected ? "primary" : "gray"} ml={2}>
            {count === null ? fallbackValue : count}
          </Badge>
        )
      )}
    </Button>
  );
};
