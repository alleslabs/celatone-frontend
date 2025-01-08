import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";

interface PageGoToProps {
  lastPage: number;
  onPageChange: (pageNumber: number) => void;
}

export const PageGoTo = ({ lastPage, onPageChange }: PageGoToProps) => {
  const [newPage, setNewPage] = useState<string>("");
  const handleGoTo = () => {
    const newPageValue = Number(newPage);
    if (newPageValue) {
      track(AmpEvent.USE_PAGINATION_GO_TO_PAGE, {
        lastPage,
        page: newPageValue,
      });
      onPageChange(newPageValue);
    }
  };

  return (
    <Flex align="center" gap={2} justify="center">
      <Text variant="body2">Go to page:</Text>
      <Input
        textAlign="center"
        value={newPage}
        w={16}
        onChange={(e) => {
          if (e.target.value.length === 0) setNewPage("");
          const value = Number(e.target.value);
          if (value && value >= 1 && value <= lastPage)
            setNewPage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter") handleGoTo();
        }}
      />
      <Button
        margin={0}
        px={2}
        variant="ghost-primary"
        onClick={handleGoTo}
        rightIcon={<CustomIcon name="chevron-right" />}
      >
        Go
      </Button>
    </Flex>
  );
};
