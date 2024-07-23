import { Box } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Option } from "lib/types";

import { NetworkCard } from "./NetworkCard";

interface NetworkCardDraggableProps {
  chainId: string;
  index?: number;
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  onClose: () => void;
}
export const NetworkCardDraggable = ({
  chainId,
  index,
  cursor,
  setCursor,
  onClose,
}: NetworkCardDraggableProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
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
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      cursor={index === undefined ? "grabbing" : "grab"}
    >
      <NetworkCard
        chainId={chainId}
        index={index}
        cursor={cursor}
        setCursor={setCursor}
        onClose={onClose}
        isDraggable
      />
    </Box>
  );
};
