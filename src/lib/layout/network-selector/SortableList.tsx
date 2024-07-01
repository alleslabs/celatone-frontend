import type { Active } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import React, { useMemo, useState } from "react";

import type { Network } from "lib/stores/networks";

// const dropAnimationConfig: DropAnimation = {
//   sideEffects: defaultDropAnimationSideEffects({
//     styles: {
//       active: {
//         opacity: "0.4",
//       },
//     },
//   }),
// };

interface SortableListProps {
  items: Network[];
  onChange(items: Network[]): void;
  renderItem(item: Network): ReactNode;
}

export const SortableList = ({
  items,
  onChange,
  renderItem,
}: SortableListProps) => {
  const [isActive, setIsActive] = useState<Active | null>(null);

  const activeItem = useMemo(
    () => items.find((item) => item.id === isActive?.id),
    [isActive, items]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setIsActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setIsActive(null);
      }}
      onDragCancel={() => {
        setIsActive(null);
      }}
    >
      <SortableContext items={items}>
        <ul className="SortableList" role="application">
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {renderItem(item)}
              {item.chainId}
            </React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <DragOverlay>{activeItem ? renderItem(activeItem) : null}</DragOverlay>
    </DndContext>
  );
};
