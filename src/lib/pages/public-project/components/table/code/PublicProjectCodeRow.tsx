import { Box, Grid, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { useInternalNavigate } from "lib/app-provider";
import { InstantiateButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { RemoveCodeModal } from "lib/components/modal/code/RemoveCode";
import { SaveOrRemoveCodeModal } from "lib/components/modal/code/SaveOrRemoveCode";
import { PermissionChip } from "lib/components/PermissionChip";
import { TableRowNoBorder } from "lib/components/table";
import { getAddressTypeByLength } from "lib/hooks";

import type { PublicCodeInfo } from "./PublicProjectCodeTable";

interface CodeTableRowProps {
  publicCodeInfo: PublicCodeInfo;
  templateColumn: string;
}

export const PublicProjectCodeRow = ({
  publicCodeInfo,
  templateColumn,
}: CodeTableRowProps) => {
  const navigate = useInternalNavigate();
  const { currentChainName } = useWallet();

  const goToCodeDetails = () => {
    navigate({
      pathname: `/code/${publicCodeInfo.publicInfo.id}`,
    });
  };

  return (
    <Grid
      _hover={{ bg: "pebble.900" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
      onClick={goToCodeDetails}
      px="32px"
      minW="min-content"
      templateColumns={templateColumn}
      borderBottom="1px solid"
      borderColor="pebble.700"
    >
      <TableRowNoBorder>
        <ExplorerLink
          value={publicCodeInfo.publicInfo.id.toString()}
          type="code_id"
          canCopyWithHover
        />
      </TableRowNoBorder>
      <TableRowNoBorder>
        <Text>{publicCodeInfo.publicInfo.name}</Text>
      </TableRowNoBorder>
      <TableRowNoBorder justifyContent="center">
        <Text>{publicCodeInfo.publicInfo.contracts}</Text>
      </TableRowNoBorder>
      <TableRowNoBorder>
        <ExplorerLink
          value={publicCodeInfo.publicInfo.uploader}
          type={getAddressTypeByLength(
            currentChainName,
            publicCodeInfo.publicInfo.uploader
          )}
          canCopyWithHover
        />
      </TableRowNoBorder>
      <TableRowNoBorder>
        <PermissionChip
          instantiatePermission={
            publicCodeInfo.publicInfo.instantiatePermission
          }
          permissionAddresses={publicCodeInfo.publicInfo.permissionAddresses}
        />
      </TableRowNoBorder>
      <TableRowNoBorder justifyContent="end" gap={2}>
        <InstantiateButton
          instantiatePermission={
            publicCodeInfo.publicInfo.instantiatePermission
          }
          permissionAddresses={publicCodeInfo.publicInfo.permissionAddresses}
          codeId={publicCodeInfo.publicInfo.id}
        />
        <Box onClick={(e) => e.stopPropagation()}>
          {publicCodeInfo.localInfo.isSaved ? (
            <RemoveCodeModal
              codeId={publicCodeInfo.localInfo.id}
              name={publicCodeInfo.localInfo.name}
            />
          ) : (
            <SaveOrRemoveCodeModal codeInfo={publicCodeInfo.localInfo} />
          )}
        </Box>
      </TableRowNoBorder>
    </Grid>
  );
};
