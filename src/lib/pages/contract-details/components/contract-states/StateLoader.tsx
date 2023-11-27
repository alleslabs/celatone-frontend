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
      alignItems="center"
      justifyContent="space-between"
    >
      {isLoading ? (
        <Flex gap={4} alignItems="center">
          <Spinner size="sm" />
          <Text variant="body2" fontWeight={600} color="text.dark">
            Loading {numStatesToLoad} states...
          </Text>
          <Button size="sm" variant="outline-primary" disabled>
            Load More
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
            disabled={isCompleted}
            onClick={onLoadMore}
          >
            Load More
          </Button>
        </Flex>
      )}
      <Button
        size="sm"
        variant="outline-primary"
        disabled={isLoading}
        onClick={onDownload}
      >
        <CustomIcon name="download" />
        Download States
      </Button>
    </Flex>
  );
};
