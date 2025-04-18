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
