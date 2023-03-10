import { HStack, Grid, Text, Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { useInternalNavigate, getAddressTypeByLength } from "lib/app-provider";
import { InstantiateButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SaveOrRemoveCodeModal } from "lib/components/modal";
import { PermissionChip } from "lib/components/PermissionChip";
import { TableRowNoBorder } from "lib/components/table";
import { getCw2Info } from "lib/utils";

import type { PublicCodeInfo } from "./PublicProjectCodeTable";

interface CodeTableRowProps {
  publicCodeInfo: PublicCodeInfo;
  templateColumn: string;
}

export const PublicProjectCodeRow = ({
  publicCodeInfo: { publicInfo, localInfo },
  templateColumn,
}: CodeTableRowProps) => {
  const navigate = useInternalNavigate();
  const { currentChainName } = useWallet();
  const goToCodeDetails = () => {
    navigate({
      pathname: `/code/${publicInfo.id}`,
    });
  };

  const cw2Info = getCw2Info(publicInfo.cw2Contract, publicInfo.cw2Version);

  return (
    <Grid
      _hover={{ bg: "pebble.900" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
      onClick={goToCodeDetails}
      minW="min-content"
      templateColumns={templateColumn}
      borderBottom="1px solid"
      borderColor="pebble.700"
    >
      <TableRowNoBorder>
        <ExplorerLink
          value={publicInfo.id.toString()}
          type="code_id"
          canCopyWithHover
        />
      </TableRowNoBorder>
      <TableRowNoBorder>
        <Text>{publicInfo.name}</Text>
      </TableRowNoBorder>
      <TableRowNoBorder>
        <Text
          color={cw2Info ? "text.main" : "text.disabled"}
          wordBreak="break-all"
          whiteSpace="pre-wrap"
        >
          {cw2Info ?? "N/A"}
        </Text>
      </TableRowNoBorder>
      <TableRowNoBorder justifyContent="center">
        <Text>{publicInfo.contractCount}</Text>
      </TableRowNoBorder>
      <TableRowNoBorder>
        <ExplorerLink
          value={publicInfo.uploader}
          type={getAddressTypeByLength(currentChainName, publicInfo.uploader)}
          canCopyWithHover
        />
      </TableRowNoBorder>
      <TableRowNoBorder>
        <Flex justify="space-between" align="center" w="full">
          <PermissionChip
            instantiatePermission={publicInfo.instantiatePermission}
            permissionAddresses={publicInfo.permissionAddresses}
          />
          <HStack onClick={(e) => e.stopPropagation()}>
            <InstantiateButton
              instantiatePermission={publicInfo.instantiatePermission}
              permissionAddresses={publicInfo.permissionAddresses}
              codeId={publicInfo.id}
            />
            <SaveOrRemoveCodeModal codeInfo={localInfo} />
          </HStack>
        </Flex>
      </TableRowNoBorder>
    </Grid>
  );
};
