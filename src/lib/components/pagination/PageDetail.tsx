import type { ChangeEvent } from "react";

import { Flex, Select, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";

const PAGE_SIZES = [10, 20, 50, 100];

interface PageDetailProps {
  lastDataInPage: number;
  maxPageSize?: number;
  offsetData: number;
  onPageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  pageSize: number;
  totalData: number;
}

export const PageDetail = ({
  lastDataInPage,
  maxPageSize = Infinity,
  offsetData,
  onPageSizeChange,
  pageSize,
  totalData,
}: PageDetailProps) => (
  <Flex
    align="center"
    direction={{ base: "column", md: "row" }}
    gap={2}
    justify="center"
  >
    <Flex align="center" justify="center">
      <Text color="text.dark" minW="fit-content" variant="body3">
        Items per page:
      </Text>
      <Select
        border="none"
        cursor="pointer"
        focusBorderColor="none"
        fontSize="12px"
        h="fit-content"
        minW="70px"
        value={pageSize}
        w="fit-content"
        onChange={(e) => {
          track(AmpEvent.USE_PAGINATION_PAGE_SIZE, {
            pageSize: e.target.value,
          });
          onPageSizeChange(e);
        }}
      >
        {PAGE_SIZES.filter((size) => size <= maxPageSize).map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>
    </Flex>
    <Text minW="fit-content" ml={7} variant="body3">
      {`${offsetData.toLocaleString()} - ${lastDataInPage.toLocaleString()} of ${totalData.toLocaleString()} items`}
    </Text>
  </Flex>
);
