import { Button, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface ShowMoreButtonProps {
  showMoreText: string;
  showLessText: string;
  toggleShowMore: boolean;
  setToggleShowMore: () => void;
}
export const ShowMoreButton = ({
  showMoreText = "View full",
  showLessText = "View less",
  toggleShowMore,
  setToggleShowMore,
}: ShowMoreButtonProps) => (
  <Button
    p={0}
    rightIcon={
      <CustomIcon name={toggleShowMore ? "chevron-up" : "chevron-down"} />
    }
    color="primary.main"
    variant="none"
    w="fit-content"
    onClick={setToggleShowMore}
  >
    <Text variant="body3" color="primary.main" fontWeight={700}>
      {toggleShowMore ? showLessText : showMoreText}
    </Text>
  </Button>
);
