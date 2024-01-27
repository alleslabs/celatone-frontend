import type { FlexProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";

interface AllVotesTableProps extends FlexProps {
  onBack: () => void;
}

export const AllVotesTable = ({ onBack, ...props }: AllVotesTableProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      {...props}
      direction="column"
      background={isMobile ? "transparent" : "gray.900"}
      border="1px solid"
      borderColor={isMobile ? "transparent" : "gray.700"}
      borderRadius="8px"
      p={isMobile ? 0 : 6}
      gap={4}
    >
      <Flex
        gap={3}
        alignItems={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
      >
        <Flex gap={2}>
          <Button variant="ghost-gray" size="sm" p={0} onClick={onBack}>
            <CustomIcon name="chevron-left" boxSize={4} />
          </Button>
          <TableTitle title="All Votes" />
        </Flex>
      </Flex>
    </Flex>
  );
};
