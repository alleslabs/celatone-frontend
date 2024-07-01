import { Flex } from "@chakra-ui/react";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import { createContext, useContext } from "react";

// interface Props {
//   id: UniqueIdentifier;
// }

interface Context {
  attributes: Record<string, unknown>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export const SortableItem = () => {
  //   const {
  //     attributes,
  //     listeners,
  //     setNodeRef,
  //     setActivatorNodeRef,
  //   } = useSortable({ id });

  //   const context = useMemo(
  //     () => ({
  //       attributes,
  //       listeners,
  //       ref: setActivatorNodeRef,
  //     }),
  //     [attributes, listeners, setActivatorNodeRef]
  //   );

  return null;
  //   return (
  //     <SortableItemContext.Provider value={context}>
  //       <li className="SortableItem" ref={setNodeRef}>
  //         {children}
  //       </li>
  //     </SortableItemContext.Provider>
  //   );
};

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button
      type="button"
      className="DragHandle"
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <Flex bg="red.500">
        <svg viewBox="0 0 20 20" width="12">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </Flex>
    </button>
  );
}
