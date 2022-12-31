import { Button, Text } from "@chakra-ui/react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface ShowMoreButtonProps {
  toggleShowMore: boolean;
  setToggleShowMore: () => void;
}
export const ShowMoreButton = ({
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
    <Text variant="body3" color="primary.main">
      {toggleShowMore ? "View Less" : "View Full Description"}
    </Text>
  </Button>
);
