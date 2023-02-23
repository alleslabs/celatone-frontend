import { Flex, Text, Grid, HStack } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { InstantiateButton } from "lib/components/button";
import { CodeNameCell } from "lib/components/CodeNameCell";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SaveOrRemoveCodeModal } from "lib/components/modal/code/SaveOrRemoveCode";
import { PermissionChip } from "lib/components/PermissionChip";
import { TableRow } from "lib/components/table/tableComponents";
import type { CodeInfo } from "lib/types";

interface CodesTableRowProps {
  codeInfo: CodeInfo;
  templateColumnsStyle: string;
}

export const CodesTableRow = ({
  codeInfo,
  templateColumnsStyle,
}: CodesTableRowProps) => {
  const navigate = useInternalNavigate();

  return (
    <Grid
      templateColumns={templateColumnsStyle}
      onClick={() =>
        navigate({
          pathname: `/code/${codeInfo.id}`,
        })
      }
      _hover={{ bg: "pebble.900" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <ExplorerLink
          type="code_id"
          value={codeInfo.id.toString()}
          canCopyWithHover
        />
      </TableRow>
      <TableRow>
        <CodeNameCell code={codeInfo} />
      </TableRow>
      <TableRow>
        <Text
          variant="body2"
          onClick={(e) => e.stopPropagation()}
          cursor="text"
          w="fit-content"
          m="auto"
          px={2}
        >
          {codeInfo.contractCount ?? "N/A"}
        </Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={codeInfo.uploader}
          type="user_address"
          canCopyWithHover
        />
      </TableRow>
      <TableRow>
        <Flex justify="space-between" align="center" w="full">
          <PermissionChip
            instantiatePermission={codeInfo.instantiatePermission}
            permissionAddresses={codeInfo.permissionAddresses}
          />
          <HStack onClick={(e) => e.stopPropagation()}>
            <InstantiateButton
              instantiatePermission={codeInfo.instantiatePermission}
              permissionAddresses={codeInfo.permissionAddresses}
              codeId={codeInfo.id}
            />
            <SaveOrRemoveCodeModal codeInfo={codeInfo} />
          </HStack>
        </Flex>
      </TableRow>
    </Grid>
  );
};
