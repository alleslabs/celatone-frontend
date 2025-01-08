import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useState } from "react";

import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { MotionBox } from "lib/components/MotionBox";

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
        position="relative"
        p="16px 8px"
        align="center"
        justify="space-between"
        borderRadius="8px"
        transition="all 0.25s ease-in-out"
        cursor="pointer"
        onClick={() => setExpand((prev) => !prev)}
        _hover={{ backgroundColor: "gray.800" }}
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
      >
        <Flex
          align={{ base: "start", md: "center" }}
          gap={2}
          fontSize="16px"
          fontWeight={500}
        >
          <CustomIcon
            name={msgIcon}
            boxSize={4}
            color="primary.main"
            m={0}
            mt={{ base: 1, md: 0 }}
          />
          {content}
        </Flex>
        <Flex>
          <CustomIcon
            name="chevron-down"
            color="gray.600"
            boxSize={4}
            transform={expand ? "rotate(180deg)" : "rotate(0)"}
            transition="all 0.25s ease-in-out"
            m={0}
          />
        </Flex>
      </Flex>
      <MotionBox
        display="flex"
        overflow="hidden"
        flexDirection="column"
        gap={4}
        animate={{
          height: expand ? "auto" : 0,
        }}
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
