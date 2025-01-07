import { Button, Divider, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { trackUseExpand } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { MotionBox } from "lib/components/MotionBox";
import type { ExposedFunction } from "lib/types";
import { getVisibilityIcon } from "lib/utils";

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
        justify="space-between"
        p={{ base: 0, md: 4 }}
        borderRadius="8px"
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
              gap={1}
              lineHeight={0}
              color="text.dark"
              fontSize="14px"
              textTransform="capitalize"
            >
              <CustomIcon
                name={getVisibilityIcon(fn.visibility)}
                boxSize={3}
                color="gray.600"
              />
              {fn.visibility}
            </Flex>
          </LabelText>
          <LabelText label="is_entry" labelWeight={700}>
            <Flex
              align="center"
              gap={1}
              lineHeight={0}
              color="text.dark"
              fontSize="14px"
            >
              <CustomIcon
                name={fn.is_entry ? "check" : "close"}
                boxSize={3}
                color={fn.is_entry ? "success.main" : "gray.600"}
              />
              {String(fn.is_entry)}
            </Flex>
          </LabelText>
        </Flex>
        <Button
          size="sm"
          variant="ghost-gray"
          onClick={() => {
            trackUseExpand({
              action: expand ? "collapse" : "expand",
              component: "module_interaction_selected_function_card",
            });
            setExpand((prev) => !prev);
          }}
          rightIcon={
            <CustomIcon
              name="chevron-down"
              boxSize={3}
              color="gray.400"
              transform={expand ? "rotate(180deg)" : "rotate(0)"}
            />
          }
        >
          {expand ? "View Less" : "View More"}
        </Button>
      </Flex>
      <MotionBox
        animate={expand ? "expanded" : "collapsed"}
        display="flex"
        flexDir="column"
        gap={3}
        initial="collapsed"
        mt={{ base: 3, md: 0 }}
        p={{ base: 0, md: `0 16px ${expand ? "16px" : 0}` }}
        variants={{
          collapsed: { height: 0, opacity: 0 },
          expanded: { height: "auto", opacity: 1 },
        }}
        overflow="hidden"
        transition={{
          duration: "0.25",
          ease: "easeInOut",
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
