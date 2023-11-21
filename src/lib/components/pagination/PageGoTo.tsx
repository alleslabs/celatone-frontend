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
        page: newPageValue,
        lastPage,
      });
      onPageChange(newPageValue);
    }
  };

  return (
    <Flex align="center" justify="center" gap={2}>
      <Text variant="body2">Go to page:</Text>
      <Input
        textAlign="center"
        w={16}
        value={newPage}
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
        variant="ghost-primary"
        margin={0}
        px={2}
        onClick={handleGoTo}
        rightIcon={<CustomIcon name="chevron-right" />}
      >
        Go
      </Button>
    </Flex>
  );
};
