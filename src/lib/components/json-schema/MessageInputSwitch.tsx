import type { Option } from "lib/types";
import type { CSSProperties, Dispatch, SetStateAction } from "react";

import { Flex } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { MotionBox } from "lib/components/MotionBox";
import { useCallback, useMemo } from "react";

import { Tooltip } from "../Tooltip";

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
  tooltipLabel = "Select or fill code id first",
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
    <Tooltip hidden={!disabled} label={tooltipLabel}>
      <div style={{ marginLeft: ml }}>
        <Flex
          align="center"
          border="1px solid var(--chakra-colors-gray-700)"
          borderRadius="4px"
          direction="row"
          p={1}
          position="relative"
          sx={{ ...(disabled ? { pointerEvents: "none", opacity: 0.3 } : {}) }}
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
              type: "spring",
              stiffness: "250",
              damping: "30",
            }}
            w="96px"
          />
        </Flex>
      </div>
    </Tooltip>
  );
};
