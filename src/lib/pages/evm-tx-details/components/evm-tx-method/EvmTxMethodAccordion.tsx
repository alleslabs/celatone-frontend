import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useState } from "react";

import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { MotionBox } from "lib/components/MotionBox";

interface EvmTxMethodAccordionProps {
  children: ReactNode;
  content: ReactNode;
  msgIcon: IconKeys;
}

export const EvmTxMethodAccordion = ({
  children,
  content,
  msgIcon,
}: EvmTxMethodAccordionProps) => {
  const [expand, setExpand] = useState(true);

  return (
    <>
      <Flex
        _after={{
          bg: "gray.700",
          bottom: 0,
          content: '""',
          h: "1px",
          left: "50%",
          position: "absolute",
          transform: "translateX(-50%)",
          w: "99%",
        }}
        align="center"
        justify="space-between"
        p="16px 8px"
        _hover={{ backgroundColor: "gray.800" }}
        borderRadius="8px"
        cursor="pointer"
        onClick={() => setExpand((prev) => !prev)}
        position="relative"
        transition="all 0.25s ease-in-out"
      >
        <Flex
          align={{ base: "start", md: "center" }}
          gap={2}
          fontSize="16px"
          fontWeight={500}
        >
          <CustomIcon
            m={0}
            mt={{ base: 1, md: 0 }}
            name={msgIcon}
            boxSize={4}
            color="primary.main"
          />
          {content}
        </Flex>
        <Flex>
          <CustomIcon
            m={0}
            name="chevron-down"
            boxSize={4}
            color="gray.600"
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
        gap={4}
        flexDirection="column"
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
