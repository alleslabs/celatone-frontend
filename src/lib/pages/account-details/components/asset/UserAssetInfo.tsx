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
      as="h5"
      variant="h5"
      fontWeight="600"
      color={isZeroValue ? "text.dark" : "grey.100"}
    >
      {value}
    </Heading>
  </Flex>
);
