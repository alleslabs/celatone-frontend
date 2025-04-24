import type { Option } from "lib/types";
import type { CSSProperties, Dispatch, SetStateAction } from "react";

import { Flex } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { MotionBox } from "lib/components/MotionBox";
import { useCallback, useMemo } from "react";

import { Tooltip } from "../Tooltip";

export enum MessageTabs {
  JSON_INPUT = "JSON input",
  YOUR_SCHEMA = "Your schema",
}

export enum OutputMessageTabs {
  JSON_OUTPUT = "JSON output",
  YOUR_SCHEMA = "Your schema",
}

export const jsonInputFormKey = MessageTabs.JSON_INPUT as "JSON input";
export const yourSchemaInputFormKey = MessageTabs.YOUR_SCHEMA as "Your schema";

interface MessageInputSwitchProps<
  T extends Option<MessageTabs | OutputMessageTabs>,
> {
  currentTab: T;
  disabled?: boolean;
  isOutput?: boolean;
  ml?: CSSProperties["marginLeft"];
  onTabChange: Dispatch<SetStateAction<T>>;
  tooltipLabel?: string;
}

export const MessageInputSwitch = <
  T extends Option<MessageTabs | OutputMessageTabs>,
>({
  currentTab,
  disabled = false,
  isOutput = false,
  ml,
  onTabChange: onTabChangeProps,
  tooltipLabel = "Select or fill code ID first",
}: MessageInputSwitchProps<T>) => {
  const tabs = useMemo<T[]>(
    () => Object.values(isOutput ? OutputMessageTabs : MessageTabs),
    [isOutput]
  );
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;

  const onTabChange = useCallback(
    (tab: T) => {
      track(AmpEvent.USE_SCHEMA_TOGGLE, { tab });
      onTabChangeProps(tab);
    },
    [onTabChangeProps]
  );

  // TODO: current implementation of sliding box dimensions and position is hardcoded due to issues with ref, improve this later
  return (
    <Tooltip hidden={!disabled} label={tooltipLabel}>
      <div style={{ marginLeft: ml }}>
        <Flex
          align="center"
          border="1px solid var(--chakra-colors-gray-700)"
          borderRadius="4px"
          direction="row"
          p={1}
          position="relative"
          sx={{ ...(disabled ? { opacity: 0.3, pointerEvents: "none" } : {}) }}
        >
          {tabs.map((tab) => (
            <MotionBox
              key={tab}
              animate={currentTab === tab ? "active" : "inactive"}
              cursor="pointer"
              fontSize="12px"
              fontWeight={700}
              initial="inactive"
              p="2px 10px"
              textAlign="center"
              variants={{
                active: { color: "var(--chakra-colors-text-main)" },
                inactive: {
                  color: "var(--chakra-colors-primary-light)",
                },
              }}
              w="96px"
              zIndex={1}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </MotionBox>
          ))}
          <MotionBox
            animate={{
              left: activeIndex === 0 ? "4px" : "100px",
            }}
            backgroundColor="primary.darker"
            borderRadius="2px"
            h="22px"
            position="absolute"
            transition={{
              damping: "30",
              stiffness: "250",
              type: "spring",
            }}
            w="96px"
          />
        </Flex>
      </div>
    </Tooltip>
  );
};
