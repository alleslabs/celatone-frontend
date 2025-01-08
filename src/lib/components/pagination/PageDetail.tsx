import { Flex, Select, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { AmpEvent, track } from "lib/amplitude";

interface PageDetailProps {
  lastDataInPage: number;
  offsetData: number;
  onPageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  pageSize: number;
  totalData: number;
}

export const PageDetail = ({
  lastDataInPage,
  offsetData,
  onPageSizeChange,
  pageSize,
  totalData,
}: PageDetailProps) => (
  <Flex
    align="center"
    gap={2}
    justify="center"
    direction={{ base: "column", md: "row" }}
  >
    <Flex align="center" justify="center">
      <Text minW="fit-content" variant="body3" color="text.dark">
        Items per page:
      </Text>
      <Select
        h="fit-content"
        minW="70px"
        value={pageSize}
        w="fit-content"
        border="none"
        cursor="pointer"
        focusBorderColor="none"
        fontSize="12px"
        onChange={(e) => {
          track(AmpEvent.USE_PAGINATION_PAGE_SIZE, {
            pageSize: e.target.value,
          });
          onPageSizeChange(e);
        }}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </Select>
    </Flex>
    <Text minW="fit-content" ml={7} variant="body3">
      {`${offsetData.toLocaleString()} - ${lastDataInPage.toLocaleString()} of ${totalData.toLocaleString()} items`}
    </Text>
  </Flex>
);
