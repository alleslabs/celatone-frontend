import { Flex } from "@chakra-ui/react";
import { MobileLabel } from "lib/components/table";
import { JSX } from "react";

interface InfoItemProps {
  label: string;
  children: JSX.Element;
  minW?: number;
}

export const InfoItem = ({ label, children, minW = 40 }: InfoItemProps) => (
  <Flex direction="column" gap={1} minW={minW}>
    <MobileLabel label={label} variant="body2" />
    {children}
  </Flex>
);
