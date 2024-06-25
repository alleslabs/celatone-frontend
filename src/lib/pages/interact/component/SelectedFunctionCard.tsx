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
    <Flex direction="column" bg="gray.900" borderRadius="8px">
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
              <Divider orientation="vertical" borderColor="gray.700" />
            </>
          )}
          <LabelText label="Visibility" labelWeight={700}>
            <Flex
              align="center"
              gap={1}
              fontSize="14px"
              color="text.dark"
              lineHeight={0}
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
              fontSize="14px"
              color="text.dark"
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
          size="sm"
          variant="ghost-gray"
          rightIcon={
            <CustomIcon
              name="chevron-down"
              boxSize={3}
              color="gray.400"
              transform={expand ? "rotate(180deg)" : "rotate(0)"}
            />
          }
          onClick={() => {
            trackUseExpand({
              action: expand ? "collapse" : "expand",
              component: "module_interaction_selected_function_card",
            });
            setExpand((prev) => !prev);
          }}
        >
          {expand ? "View Less" : "View More"}
        </Button>
      </Flex>
      <MotionBox
        display="flex"
        flexDir="column"
        variants={{
          expanded: { opacity: 1, height: "auto" },
          collapsed: { opacity: 0, height: 0 },
        }}
        overflow="hidden"
        initial="collapsed"
        animate={expand ? "expanded" : "collapsed"}
        transition={{
          duration: "0.25",
          ease: "easeInOut",
        }}
        p={{ base: 0, md: `0 16px ${expand ? "16px" : 0}` }}
        mt={{ base: 3, md: 0 }}
        gap={3}
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
