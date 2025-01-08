import { Flex } from "@chakra-ui/react";

import { MobileLabel } from "lib/components/table";

interface InfoItemProps {
  children: JSX.Element;
  label: string;
  minW?: number;
}

export const InfoItem = ({ children, label, minW = 40 }: InfoItemProps) => (
  <Flex gap={1} minW={minW} direction="column">
    <MobileLabel label={label} variant="body2" />
    {children}
  </Flex>
);
