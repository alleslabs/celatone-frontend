import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import plur from "plur";

import { CustomIcon } from "lib/components/icon";

interface StateLoaderProps {
  isCompleted: boolean;
  isLoading: boolean;
  numStatesToLoad: number;
  onDownload: () => void;
  onLoadMore: () => void;
  totalData: number;
}
export const StateLoader = ({
  isCompleted,
  isLoading,
  numStatesToLoad,
  onDownload,
  onLoadMore,
  totalData,
}: StateLoaderProps) => {
  const stateAmountText = `${totalData} ${plur("State", totalData)}`;

  return (
    <Flex
      alignItems={{ base: "flex-start", md: "center" }}
      p={3}
      bgColor="gray.900"
      borderRadius={8}
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
    >
      {isLoading ? (
        <Flex alignItems="center" gap={4}>
          <Spinner size="sm" />
          <Text variant="body2" color="text.dark" fontWeight={600}>
            Loading {numStatesToLoad} states...
          </Text>
          <Button isDisabled size="sm" variant="outline-primary">
            Load More
          </Button>
        </Flex>
      ) : (
        <Flex alignItems="center" gap={4}>
          <CustomIcon name="check" color="success.main" />
          <Text variant="body2" color="text.dark" fontWeight={600}>
            {isCompleted
              ? `All States Loaded (${stateAmountText})`
              : `${stateAmountText} Loaded`}
          </Text>
          <Button
            isDisabled={isCompleted}
            size="sm"
            variant="outline-primary"
            onClick={onLoadMore}
          >
            Load More
          </Button>
        </Flex>
      )}
      <Button
        isDisabled={isLoading}
        mt={{ base: 3, md: 0 }}
        size="sm"
        variant="outline-primary"
        w={{ base: "full", md: "auto" }}
        onClick={onDownload}
      >
        <CustomIcon name="download" />
        Download States
      </Button>
    </Flex>
  );
};
