import { Text } from "@chakra-ui/react";

interface MobileLabelProps {
  label: string;
  fontWeight?: number;
  variant?: string;
}

export const MobileLabel = ({
  fontWeight = 600,
  label,
  variant = "body3",
}: MobileLabelProps) => (
  <Text
    color="text.dark"
    fontWeight={fontWeight}
    variant={variant}
    whiteSpace="nowrap"
  >
    {label}
  </Text>
);
