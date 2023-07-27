import type { TabProps } from "@chakra-ui/react";
import {
  Skeleton,
  Button,
  useTab,
  Badge,
  useMultiStyleConfig,
} from "@chakra-ui/react";

interface CustomTabProps extends TabProps {
  count?: number | string;
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
      fontWeight={700}
      lineHeight="24px"
      letterSpacing="0.4px"
      variant="ghost-gray"
      mb={0}
      sx={{
        "&[aria-selected=true]": {
          color: "primary.light",
        },
        "&[aria-selected=false]": {
          color: "gray.500",
        },
      }}
      _active={{
        bg: "unset",
      }}
      {...tabProps}
    >
      {tabProps.children}

      {!count ? (
        <Skeleton
          ml={2}
          h={4}
          w={8}
          borderRadius={8}
          startColor="gray.500"
          endColor="gray.700"
        />
      ) : (
        <Badge variant={isSelected ? "primary" : "gray"} ml={2}>
          {count}
        </Badge>
      )}
    </Button>
  );
};
