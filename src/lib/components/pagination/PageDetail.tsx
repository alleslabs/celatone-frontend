import { Flex, Select, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { CustomIcon } from "../icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

interface PageDetailProps {
  pageSize: number;
  offsetData: number;
  lastDataInPage: number;
  totalData: number;
  onPageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const PageDetail = ({
  pageSize,
  offsetData,
  lastDataInPage,
  totalData,
  onPageSizeChange,
}: PageDetailProps) => (
  <Flex
    align="center"
    justify="center"
    direction={{ base: "column", md: "row" }}
    gap={2}
  >
    <Flex align="center" justify="center">
      <Text variant="body3" color="text.dark" minW="fit-content">
        Items per page:
      </Text>
      <Select
        border="none"
        minW="70px"
        w="fit-content"
        h="fit-content"
        fontSize="12px"
        focusBorderColor="none"
        cursor="pointer"
        value={pageSize}
        onChange={(e) => {
          AmpTrack(AmpEvent.USE_PAGINATION_PAGE_SIZE, {
            pageSize: e.target.value,
          });
          onPageSizeChange(e);
        }}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <CustomIcon name="chevron-down" color="gray.600" />
      </Select>
    </Flex>
    <Text variant="body3" minW="fit-content" ml={7}>
      {`${offsetData.toLocaleString()} - ${lastDataInPage.toLocaleString()} of ${totalData.toLocaleString()} items`}
    </Text>
  </Flex>
);
