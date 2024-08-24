import { Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { Copier } from "lib/components/copy";
import { MoveVerifyBadge } from "lib/components/MoveVerifyBadge";
import type { HexAddr, MoveVerifyStatus } from "lib/types";
import { mergeModulePath, truncate } from "lib/utils";

interface ModulePathLinkProps {
  hexAddr: HexAddr;
  moduleName: string;
  moveVerifyStatus?: MoveVerifyStatus;
}

export const ModulePathLink = ({
  hexAddr,
  moduleName,
  moveVerifyStatus,
}: ModulePathLinkProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      className="copier-wrapper"
      display={{ base: "inline-flex", md: "flex" }}
      align="center"
      h={{ base: "auto", md: "24px" }}
      gap={1}
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
      {moveVerifyStatus && <MoveVerifyBadge status={moveVerifyStatus} />}
      <Copier
        type="module_path"
        value={mergeModulePath(hexAddr, moduleName)}
        copyLabel="Copied!"
        display={!isMobile ? "none" : "inline"}
        amptrackSection="module_table"
        ml={0}
      />
    </Flex>
  );
};
