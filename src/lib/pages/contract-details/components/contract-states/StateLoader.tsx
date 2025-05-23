import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import plur from "plur";

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
      bgColor="gray.900"
      borderRadius={8}
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
      p={3}
    >
      {isLoading ? (
        <Flex alignItems="center" gap={4}>
          <Spinner size="sm" />
          <Text color="text.dark" fontWeight={600} variant="body2">
            Loading {numStatesToLoad} states...
          </Text>
          <Button isDisabled size="sm" variant="outline-primary">
            Load more
          </Button>
        </Flex>
      ) : (
        <Flex alignItems="center" gap={4}>
          <CustomIcon color="success.main" name="check" />
          <Text color="text.dark" fontWeight={600} variant="body2">
            {isCompleted
              ? `All states loaded (${stateAmountText})`
              : `${stateAmountText} loaded`}
          </Text>
          <Button
            isDisabled={isCompleted}
            size="sm"
            variant="outline-primary"
            onClick={onLoadMore}
          >
            Load more
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
        Download states
      </Button>
    </Flex>
  );
};
