import type { HexAddr, MoveVerifyStatus } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { Copier } from "lib/components/copy";
import { MoveVerifyBadge } from "lib/components/MoveVerifyBadge";
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
      align="center"
      display={{ base: "inline-flex", md: "flex" }}
      gap={1}
      h={{ base: "auto", md: "24px" }}
    >
      <AppLink
        href={`/modules/${hexAddr}/${moduleName}`}
        passHref
        onClick={(e) => e.stopPropagation()}
      >
        <Text
          _hover={{ color: "primary.light", textDecoration: "underline" }}
          color="primary.main"
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          variant="body2"
          wordBreak={{ base: "break-all", md: "inherit" }}
        >
          {`${truncate(hexAddr)} :: ${moduleName}`}
        </Text>
      </AppLink>
      {moveVerifyStatus && (
        <MoveVerifyBadge hasTooltip status={moveVerifyStatus} />
      )}
      <Copier
        amptrackSection="module_table"
        copyLabel="Copied!"
        display={!isMobile ? "none" : "inline"}
        ml={0}
        type="module_path"
        value={mergeModulePath(hexAddr, moduleName)}
      />
    </Flex>
  );
};
