import { Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
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
      h={{ base: "auto", md: "24px" }}
    >
      <AppLink
        href={`/modules/${hexAddr}/${moduleName}`}
        passHref
        onClick={(e) => e.stopPropagation()}
      >
        <Text
          variant="body2"
          color="primary.main"
          transition="all 0.25s ease-in-out"
          _hover={{ color: "primary.light", textDecoration: "underline" }}
          wordBreak={{ base: "break-all", md: "inherit" }}
          cursor="pointer"
        >
          {`${truncate(hexAddr)} :: ${moduleName}`}
        </Text>
      </AppLink>
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
