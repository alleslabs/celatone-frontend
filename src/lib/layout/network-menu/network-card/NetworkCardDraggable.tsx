import { Box } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Option } from "lib/types";

import { NetworkCard } from "./NetworkCard";

interface NetworkCardDraggableProps {
  chainId: string;
  cursor: Option<number>;
  index?: number;
  onClose: () => void;
  setCursor: (index: Option<number>) => void;
}
export const NetworkCardDraggable = ({
  chainId,
  cursor,
  index,
  onClose,
  setCursor,
}: NetworkCardDraggableProps) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: chainId,
  });

  const style = {
    opacity: isDragging ? 0 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      cursor={index === undefined ? "grabbing" : "grab"}
    >
      <NetworkCard
        chainId={chainId}
        index={index}
        isDraggable
        cursor={cursor}
        onClose={onClose}
        setCursor={setCursor}
      />
    </Box>
  );
};
