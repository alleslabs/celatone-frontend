import { Box } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { CHAIN_CONFIGS } from "config/chain";
import type { Option } from "lib/types";

import { NetworkCard } from "./NetworkCard";

interface NetworkDragItemWrapperProps {
  chainId: string;
  currentChainId: string;
  index?: number;
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  onClose: () => void;
}
export const NetworkDragItemWrapper = ({
  chainId,
  currentChainId,
  index,
  cursor,
  setCursor,
  onClose,
}: NetworkDragItemWrapperProps) => {
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
    opacity: isDragging ? 0.7 : undefined,
    cursor: isDragging ? "grabbing" : "grab",
    transform: transform ? CSS.Transform.toString(transform) : "none",
    transition: transition || "transform 250ms ease",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => e.stopPropagation()}
    >
      <NetworkCard
        isDraggable
        image={CHAIN_CONFIGS[chainId]?.logoUrl}
        chainId={chainId}
        isSelected={chainId === currentChainId}
        index={index}
        cursor={cursor}
        setCursor={setCursor}
        onClose={onClose}
      />
    </Box>
  );
};
