import type { TabProps } from "@chakra-ui/react";
import type { Nullish } from "lib/types";

import {
  Badge,
  Button,
  Skeleton,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";

interface CustomTabProps extends TabProps {
  count?: Nullish<number>;
  isLoading?: boolean;
}

export const CustomTab = ({
  count,
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
      fontSize="14px"
      fontWeight={700}
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
          color: "white",
        },
      }}
      variant="ghost-gray"
      {...tabProps}
    >
      {tabProps.children}

      {isLoading ? (
        <Skeleton
          borderRadius={8}
          endColor="gray.700"
          h={4}
          ml={2}
          startColor="gray.500"
          w={8}
        />
      ) : (
        !!count &&
        count > 0 && (
          <Badge ml={2} variant={isSelected ? "white" : "gray"}>
            {count}
          </Badge>
        )
      )}
    </Button>
  );
};
