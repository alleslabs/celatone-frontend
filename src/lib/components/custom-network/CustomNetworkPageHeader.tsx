import { Flex, Heading } from "@chakra-ui/react";
import { CustomerNetworkAlertInfo } from "lib/pages/custom-network/components";

interface CustomNetworkPageHeaderProps {
  hasAlert?: boolean;
  subtitle?: string;
  title: string;
}

export const CustomNetworkPageHeader = ({
  hasAlert = true,
  subtitle = "Add custom rollup",
  title,
}: CustomNetworkPageHeaderProps) => (
  <>
    <Flex alignItems="center" direction="column" gap={2}>
      <Heading as="h6" color="text.dark" variant="h6">
        {subtitle}
      </Heading>
      <Heading as="h4" variant="h4">
        {title}
      </Heading>
    </Flex>
    {hasAlert && <CustomerNetworkAlertInfo />}
  </>
);
