import { Flex, Heading, Text } from "@chakra-ui/react";

interface UserAssetInfoCardProps {
  helperText?: string;
  isZeroValue: boolean;
  value: string;
}
export const UserAssetInfoCard = ({
  helperText,
  isZeroValue,
  value,
}: UserAssetInfoCardProps) => (
  <Flex direction="column" width="fit-content">
    <Text variant="body2" fontWeight="500" color="text.dark">
      {helperText}
    </Text>
    <Heading
      as="h6"
      variant="h6"
      fontWeight="600"
      color={isZeroValue ? "text.dark" : "text.main"}
    >
      {value}
    </Heading>
  </Flex>
);
