import type { IconKeys } from "lib/components/icon";
import type { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { MotionBox } from "lib/components/MotionBox";
import { useState } from "react";

interface EvmTxMethodAccordionProps {
  msgIcon: IconKeys;
  content: ReactNode;
  children: ReactNode;
}

export const EvmTxMethodAccordion = ({
  msgIcon,
  content,
  children,
}: EvmTxMethodAccordionProps) => {
  const [expand, setExpand] = useState(true);

  return (
    <>
      <Flex
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          h: "1px",
          w: "99%",
          bg: "gray.700",
        }}
        _hover={{ backgroundColor: "gray.800" }}
        align="center"
        borderRadius="8px"
        cursor="pointer"
        justify="space-between"
        p="16px 8px"
        position="relative"
        transition="all 0.25s ease-in-out"
        onClick={() => setExpand((prev) => !prev)}
      >
        <Flex
          align={{ base: "start", md: "center" }}
          fontSize="16px"
          fontWeight={500}
          gap={2}
        >
          <CustomIcon
            boxSize={4}
            color="primary.main"
            m={0}
            mt={{ base: 1, md: 0 }}
            name={msgIcon}
          />
          {content}
        </Flex>
        <Flex>
          <CustomIcon
            boxSize={4}
            color="gray.600"
            m={0}
            name="chevron-down"
            transform={expand ? "rotate(180deg)" : "rotate(0)"}
            transition="all 0.25s ease-in-out"
          />
        </Flex>
      </Flex>
      <MotionBox
        animate={{
          height: expand ? "auto" : 0,
        }}
        display="flex"
        flexDirection="column"
        gap={4}
        overflow="hidden"
        transition={{
          duration: "0.25",
          ease: "easeInOut",
        }}
      >
        {children}
      </MotionBox>
    </>
  );
};
