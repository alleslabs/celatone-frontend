import { Flex } from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";

import { Tooltip } from "../Tooltip";
import { MotionBox } from "lib/components/MotionBox";
import type { Option } from "lib/types";

export enum MessageTabs {
  JSON_INPUT = "JSON Input",
  YOUR_SCHEMA = "Your Schema",
}

export enum OutputMessageTabs {
  JSON_OUTPUT = "JSON Output",
  YOUR_SCHEMA = "Your Schema",
}

export const jsonInputFormKey = MessageTabs.JSON_INPUT as "JSON Input";
export const yourSchemaInputFormKey = MessageTabs.YOUR_SCHEMA as "Your Schema";

interface MessageInputSwitchProps<
  T extends Option<MessageTabs | OutputMessageTabs>
> {
  currentTab: T;
  disabled?: boolean;
  tooltipLabel?: string;
  ml?: CSSProperties["marginLeft"];
  isOutput?: boolean;
  onTabChange: Dispatch<SetStateAction<T>>;
}

export const MessageInputSwitch = <
  T extends Option<MessageTabs | OutputMessageTabs>
>({
  currentTab,
  disabled = false,
  tooltipLabel = "Select or fill code id first",
  ml,
  isOutput = false,
  onTabChange,
}: MessageInputSwitchProps<T>) => {
  const tabs = useMemo(
    () => Object.values(isOutput ? OutputMessageTabs : MessageTabs),
    [isOutput]
  );
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : -1;
  return (
    <Tooltip label={tooltipLabel} isDisabled={!disabled}>
      <div style={{ marginLeft: ml }}>
        <Flex
          border="1px solid var(--chakra-colors-gray-700)"
          borderRadius="4px"
          p={1}
          direction="row"
          align="center"
          position="relative"
          sx={{ ...(disabled ? { pointerEvents: "none", opacity: 0.3 } : {}) }}
        >
          {tabs.map((tab, idx) => (
            <MotionBox
              key={tab}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              cursor="pointer"
              p="2px 10px"
              fontSize="12px"
              fontWeight={700}
              variants={{
                active: { color: "var(--chakra-colors-text-main)" },
                inactive: {
                  color: "var(--chakra-colors-primary-light)",
                },
              }}
              initial="inactive"
              animate={currentTab === tab ? "active" : "inactive"}
              onClick={() => onTabChange(tab)}
              zIndex={1}
              textAlign="center"
            >
              {tab}
            </MotionBox>
          ))}
          <MotionBox
            h={`${tabRefs.current[activeIndex]?.clientHeight}px`}
            w={`${tabRefs.current[activeIndex]?.clientWidth}px`}
            position="absolute"
            borderRadius="2px"
            backgroundColor="primary.dark"
            animate={{
              left: `${tabRefs.current[activeIndex]?.offsetLeft ?? 0}px`,
            }}
            transition={{
              type: "spring",
              stiffness: "250",
              damping: "30",
            }}
          />
        </Flex>
      </div>
    </Tooltip>
  );
};
