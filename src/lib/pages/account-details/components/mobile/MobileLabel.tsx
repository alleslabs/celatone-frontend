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
}: MobileLabelProps) => {
  return (
    <Text color="text.dark" variant={variant} fontWeight={fontWeight}>
      {label}
    </Text>
  );
};
