import { Button, Flex, Spinner, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface StateLoaderProps {
  isLoading: boolean;
  isCompleted: boolean;
  totalData: number;
  onLoadMore: () => void;
  onDownload: () => void;
}
export const StateLoader = ({
  isLoading,
  isCompleted,
  totalData,
  onLoadMore,
  onDownload,
}: StateLoaderProps) => {
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
            Loading 100 states...
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
              ? `All States Loaded (${totalData} States)`
              : `${totalData} States Loaded`}
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
