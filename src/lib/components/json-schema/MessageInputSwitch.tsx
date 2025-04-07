import { Flex } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { MotionBox } from "lib/components/MotionBox";
import type { Option } from "lib/types";
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
  tooltipLabel?: string;
  ml?: CSSProperties["marginLeft"];
  isOutput?: boolean;
  onTabChange: Dispatch<SetStateAction<T>>;
}

export const MessageInputSwitch = <
  T extends Option<MessageTabs | OutputMessageTabs>,
>({
  currentTab,
  disabled = false,
  tooltipLabel = "Select or fill code ID first",
  ml,
  isOutput = false,
  onTabChange: onTabChangeProps,
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
    <Tooltip label={tooltipLabel} hidden={!disabled}>
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
          {tabs.map((tab) => (
            <MotionBox
              key={tab}
              cursor="pointer"
              p="2px 10px"
              w="96px"
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
            w="96px"
            h="22px"
            position="absolute"
            borderRadius="2px"
            backgroundColor="primary.darker"
            animate={{
              left: activeIndex === 0 ? "4px" : "100px",
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
