import { Flex, Text, Grid, Box, Button } from "@chakra-ui/react";
import Link from "next/link";

import { TableRow } from "../tableComponents";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ModuleInfo } from "lib/services/move";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

interface ModulesTableRowProps {
  module: ModuleInfo;
  templateColumns: string;
}

export const ModulesTableRow = ({
  module,
  templateColumns,
}: ModulesTableRowProps) => {
  const modulePath = `${truncate(module.address, [5, 7])}::${module.name}`;
  const timeStamp = new Date(module.latest_updated);

  const buttonStyles = {
    border: "1px solid",
    borderColor: "gray.600",
    bg: "inherit",
    borderRadius: "8px",
    fontSize: "12px",
    textColor: "gray.600",
    p: "4px 8px",
  };

  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        _hover={{ background: "gray.900" }}
        transition="all 0.25s ease-in-out"
      >
        <TableRow>
          <Link href={`/modules/${module.address}/${module.name}`}>
            <Text
              color="secondary.main"
              transition="all 0.25s ease-in-out"
              _hover={{ color: "secondary.light" }}
              wordBreak={{ base: "break-all", md: "inherit" }}
              cursor="pointer"
            >
              {modulePath.toLowerCase()}
            </Text>
          </Link>
        </TableRow>
        <TableRow>
          <ExplorerLink
            value={module.address}
            type="user_address"
            showCopyOnHover
          />
        </TableRow>
        <TableRow>
          <Flex direction="column" gap={1}>
            <Text variant="body3">{formatUTC(timeStamp)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(timeStamp)})`}
            </Text>
          </Flex>
        </TableRow>
        <TableRow>
          <Flex gap="8px">
            <Link
              href={`/interact?address=${module.address}&moduleName=${module.name}&functionType=view`}
            >
              <Button {...buttonStyles}>View</Button>
            </Link>
            <Link
              href={`/interact?address=${module.address}&moduleName=${module.name}&functionType=execute`}
            >
              <Button {...buttonStyles}>Execute</Button>
            </Link>
          </Flex>
        </TableRow>
      </Grid>
    </Box>
  );
};
