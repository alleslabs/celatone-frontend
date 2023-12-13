import { Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import type { HexAddr } from "lib/types";
import { truncate } from "lib/utils";

interface ModulePathLinkProps {
  hexAddr: HexAddr;
  moduleName: string;
}

export const ModulePathLink = ({
  hexAddr,
  moduleName,
}: ModulePathLinkProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      className="copier-wrapper"
      display={{ base: "inline-flex", md: "flex" }}
      align="center"
      h="24px"
    >
      <Text
        variant="body2"
        color="secondary.main"
        transition="all 0.25s ease-in-out"
        _hover={{ color: "secondary.light", textDecoration: "underline" }}
        wordBreak={{ base: "break-all", md: "inherit" }}
        cursor="pointer"
      >
        {`${truncate(hexAddr)} :: ${moduleName}`}
      </Text>
      <Copier
        type="module_path"
        value={`${hexAddr}::${moduleName}`}
        copyLabel="Copied!"
        display={!isMobile ? "none" : "inline"}
        ml={2}
        amptrackSection="module_table"
      />
    </Flex>
  );
};
