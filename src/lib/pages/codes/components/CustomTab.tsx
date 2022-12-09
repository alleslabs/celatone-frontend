import type { TabProps } from "@chakra-ui/react";
import { Button, useTab, Badge, useMultiStyleConfig } from "@chakra-ui/react";

interface CustomTabProps extends TabProps {
  codeCount: number;
}

const CustomTab = ({ codeCount, ...restProps }: CustomTabProps) => {
  const tabProps = useTab({ ...restProps });
  const isSelected = tabProps["aria-selected"];
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      {...tabProps}
      fontWeight="700"
      lineHeight="24px"
      letterSpacing="0.4px"
      variant="ghost"
      sx={{
        "&[aria-selected=true]": {
          color: "primary.main",
        },
      }}
      _active={{
        bg: "unset",
      }}
    >
      {tabProps.children}

      <Badge variant={isSelected ? "primary" : "gray"} ml="6px">
        {codeCount}
      </Badge>
    </Button>
  );
};

export default CustomTab;
