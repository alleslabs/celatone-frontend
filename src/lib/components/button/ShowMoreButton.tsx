import { Button, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface ShowMoreButtonProps {
  setToggleShowMore: () => void;
  showLessText: string;
  showMoreText: string;
  toggleShowMore: boolean;
}
export const ShowMoreButton = ({
  setToggleShowMore,
  showLessText = "View Less",
  showMoreText = "View Full",
  toggleShowMore,
}: ShowMoreButtonProps) => (
  <Button
    p={0}
    variant="none"
    w="fit-content"
    color="primary.main"
    onClick={setToggleShowMore}
    rightIcon={
      <CustomIcon name={toggleShowMore ? "chevron-up" : "chevron-down"} />
    }
  >
    <Text variant="body3" color="primary.main" fontWeight={700}>
      {toggleShowMore ? showLessText : showMoreText}
    </Text>
  </Button>
);
