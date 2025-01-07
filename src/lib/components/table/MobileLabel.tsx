import { Text } from "@chakra-ui/react";

interface MobileLabelProps {
  fontWeight?: number;
  label: string;
  variant?: string;
}

export const MobileLabel = ({
  fontWeight = 600,
  label,
  variant = "body3",
}: MobileLabelProps) => (
  <Text
    variant={variant}
    whiteSpace="nowrap"
    color="text.dark"
    fontWeight={fontWeight}
    textTransform="capitalize"
  >
    {label}
  </Text>
);
