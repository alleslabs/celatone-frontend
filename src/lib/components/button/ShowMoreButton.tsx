import { Button, Text } from "@chakra-ui/react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface ShowMoreButtonProps {
  showMoreText: string;
  showLessText: string;
  toggleShowMore: boolean;
  setToggleShowMore: () => void;
}
export const ShowMoreButton = ({
  showMoreText = "View Full",
  showLessText = "View Less",
  toggleShowMore,
  setToggleShowMore,
}: ShowMoreButtonProps) => (
  <Button
    p="0"
    rightIcon={toggleShowMore ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
    color="primary.main"
    variant="none"
    w="fit-content"
    onClick={setToggleShowMore}
  >
    <Text variant="body3" color="primary.main" fontWeight="700">
      {toggleShowMore ? showLessText : showMoreText}
    </Text>
  </Button>
);
