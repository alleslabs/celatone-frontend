import type { TabProps } from "@chakra-ui/react";
import { Button, useTab, Badge, useMultiStyleConfig } from "@chakra-ui/react";

interface CustomTabProps extends TabProps {
  count?: number;
}

export const CustomTab = ({ count, ...restProps }: CustomTabProps) => {
  const tabProps = useTab({ ...restProps });
  const isSelected = tabProps["aria-selected"];
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      display="flex"
      alignItems="center"
      fontSize="14px"
      fontWeight="700"
      lineHeight="24px"
      letterSpacing="0.4px"
      variant="ghost-gray"
      mb={0}
      sx={{
        "&[aria-selected=true]": {
          color: "violet.light",
        },
        "&[aria-selected=false]": {
          color: "pebble.500",
        },
      }}
      _active={{
        bg: "unset",
      }}
      {...tabProps}
    >
      {tabProps.children}

      {count !== undefined && (
        <Badge variant={isSelected ? "violet" : "gray"} ml="6px">
          {count}
        </Badge>
      )}
    </Button>
  );
};
