import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import plur from "plur";

import { CustomIcon } from "lib/components/icon";

interface StateLoaderProps {
  numStatesToLoad: number;
  isLoading: boolean;
  isCompleted: boolean;
  totalData: number;
  onLoadMore: () => void;
  onDownload: () => void;
}
export const StateLoader = ({
  numStatesToLoad,
  isLoading,
  isCompleted,
  totalData,
  onLoadMore,
  onDownload,
}: StateLoaderProps) => {
  const stateAmountText = `${totalData} ${plur("State", totalData)}`;

  return (
    <Flex
      borderRadius={8}
      bgColor="gray.900"
      p={3}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent="space-between"
      direction={{ base: "column", md: "row" }}
    >
      {isLoading ? (
        <Flex gap={4} alignItems="center">
          <Spinner size="sm" />
          <Text variant="body2" fontWeight={600} color="text.dark">
            Loading {numStatesToLoad} states...
          </Text>
          <Button size="sm" variant="outline-primary" isDisabled>
            Load more
          </Button>
        </Flex>
      ) : (
        <Flex gap={4} alignItems="center">
          <CustomIcon name="check" color="success.main" />
          <Text variant="body2" fontWeight={600} color="text.dark">
            {isCompleted
              ? `All States Loaded (${stateAmountText})`
              : `${stateAmountText} Loaded`}
          </Text>
          <Button
            size="sm"
            variant="outline-primary"
            isDisabled={isCompleted}
            onClick={onLoadMore}
          >
            Load more
          </Button>
        </Flex>
      )}
      <Button
        size="sm"
        mt={{ base: 3, md: 0 }}
        w={{ base: "full", md: "auto" }}
        variant="outline-primary"
        isDisabled={isLoading}
        onClick={onDownload}
      >
        <CustomIcon name="download" />
        Download states
      </Button>
    </Flex>
  );
};
