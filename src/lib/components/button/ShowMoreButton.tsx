import { Button, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface ShowMoreButtonProps {
  showMoreText: string;
  showLessText: string;
  toggleShowMore: boolean;
  setToggleShowMore: () => void;
}
export const ShowMoreButton = ({
  setToggleShowMore,
  showLessText = "View less",
  showMoreText = "View full",
  toggleShowMore,
}: ShowMoreButtonProps) => (
  <Button
    color="primary.main"
    p={0}
    rightIcon={
      <CustomIcon name={toggleShowMore ? "chevron-up" : "chevron-down"} />
    }
    variant="none"
    w="fit-content"
    onClick={setToggleShowMore}
  >
    <Text color="primary.main" fontWeight={700} variant="body3">
      {toggleShowMore ? showLessText : showMoreText}
    </Text>
  </Button>
);
