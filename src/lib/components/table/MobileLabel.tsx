import { Text } from "@chakra-ui/react";

interface MobileLabelProps {
  label: string;
  fontWeight?: number;
  variant?: string;
}

export const MobileLabel = ({
  label,
  fontWeight = 600,
  variant = "body3",
}: MobileLabelProps) => (
  <Text
    color="text.dark"
    variant={variant}
    fontWeight={fontWeight}
    whiteSpace="nowrap"
  >
    {label}
  </Text>
);
