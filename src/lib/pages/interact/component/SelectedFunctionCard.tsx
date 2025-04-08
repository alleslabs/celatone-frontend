import type { ExposedFunction } from "lib/types";

import { Button, Divider, Flex } from "@chakra-ui/react";
import { trackUseExpand } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { MotionBox } from "lib/components/MotionBox";
import { getVisibilityIcon } from "lib/utils";
import { useState } from "react";

interface SelectedFunctionCardProps {
  fn: ExposedFunction;
}

export const SelectedFunctionCard = ({ fn }: SelectedFunctionCardProps) => {
  const isMobile = useMobile();
  const [expand, setExpand] = useState(false);
  return (
    <Flex bg="gray.900" borderRadius="8px" direction="column">
      <Flex
        align="center"
        borderRadius="8px"
        justify="space-between"
        p={{ base: 0, md: 4 }}
      >
        <Flex gap={8} h="full">
          {!isMobile && (
            <>
              <LabelText label="Selected function" labelWeight={700}>
                {fn.name}
              </LabelText>
              <Divider borderColor="gray.700" orientation="vertical" />
            </>
          )}
          <LabelText label="Visibility" labelWeight={700}>
            <Flex
              align="center"
              color="text.dark"
              fontSize="14px"
              gap={1}
              lineHeight={0}
              textTransform="capitalize"
            >
              <CustomIcon
                boxSize={3}
                color="gray.600"
                name={getVisibilityIcon(fn.visibility)}
              />
              {fn.visibility}
            </Flex>
          </LabelText>
          <LabelText label="is_entry" labelWeight={700}>
            <Flex
              align="center"
              color="text.dark"
              fontSize="14px"
              gap={1}
              lineHeight={0}
            >
              <CustomIcon
                boxSize={3}
                color={fn.is_entry ? "success.main" : "gray.600"}
                name={fn.is_entry ? "check" : "close"}
              />
              {String(fn.is_entry)}
            </Flex>
          </LabelText>
        </Flex>
        <Button
          rightIcon={
            <CustomIcon
              boxSize={3}
              color="gray.400"
              name="chevron-down"
              transform={expand ? "rotate(180deg)" : "rotate(0)"}
            />
          }
          size="sm"
          variant="ghost-gray"
          onClick={() => {
            trackUseExpand({
              action: expand ? "collapse" : "expand",
              component: "module_interaction_selected_function_card",
            });
            setExpand((prev) => !prev);
          }}
        >
          {expand ? "View less" : "View more"}
        </Button>
      </Flex>
      <MotionBox
        animate={expand ? "expanded" : "collapsed"}
        display="flex"
        flexDir="column"
        gap={3}
        initial="collapsed"
        mt={{ base: 3, md: 0 }}
        overflow="hidden"
        p={{ base: 0, md: `0 16px ${expand ? "16px" : 0}` }}
        transition={{
          duration: "0.25",
          ease: "easeInOut",
        }}
        variants={{
          expanded: { opacity: 1, height: "auto" },
          collapsed: { opacity: 0, height: 0 },
        }}
      >
        <LabelText label="generic_type_params" labelWeight={700}>
          {JSON.stringify(fn.generic_type_params)}
        </LabelText>
        <LabelText label="params" labelWeight={700}>
          {JSON.stringify(fn.params)}
        </LabelText>
      </MotionBox>
    </Flex>
  );
};
