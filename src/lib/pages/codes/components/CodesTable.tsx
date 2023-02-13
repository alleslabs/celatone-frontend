import {
  Icon,
  Heading,
  HStack,
  VStack,
  Text,
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { ReactNode } from "react";
import { MdSearchOff } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { InstantiateButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SaveOrRemoveCodeModal } from "lib/components/modal/code/SaveOrRemoveCode";
import { PermissionChip } from "lib/components/PermissionChip";
import { DisconnectedState } from "lib/components/state/DisconnectedState";
import {
  TableContainer,
  TableHeaderNoBorder,
  TableRowNoBorder,
} from "lib/components/table";
import type { CodeInfo } from "lib/types";

import { CodeNameCell } from "./CodeNameCell";

// Types of Table: Recent Codes / My Stored Codes / My Saved Codes
type TableType = "recent" | "stored" | "saved";

interface CodesTableProps {
  type: TableType;
  tableName: string;
  codes: CodeInfo[];
  action?: ReactNode;
  isSearching: boolean;
}

interface CodesRowProps {
  code: CodeInfo;
}

interface OtherTBodyProps {
  type: TableType;
}

const TEMPLATE_COLUMNS =
  "max(80px) minmax(320px, 1fr) max(120px) max(160px) minmax(320px, 0.75fr)";

const StateContainer = ({ children }: { children: ReactNode }) => (
  <VStack
    borderTopWidth={1}
    borderBottomWidth={1}
    minH="128px"
    justifyContent="center"
    py={8}
  >
    {children}
  </VStack>
);

const NotMatched = () => {
  return (
    <StateContainer>
      <Icon as={MdSearchOff} width="64px" height="64px" color="pebble.600" />
      <Text color="text.dark">No matched codes found.</Text>
    </StateContainer>
  );
};

const Unconnected = () => {
  return (
    <StateContainer>
      <DisconnectedState text="to see your previously uploaded and stored codes." />
    </StateContainer>
  );
};

const Empty = ({ type }: OtherTBodyProps) => {
  const renderEmptyText = () => {
    switch (type) {
      case "recent":
        return "Most recent 100 code IDs will display here";
      case "saved":
        return "Your saved code IDs will display here. Saved codes are stored locally on your device.";
      case "stored":
        return "Your uploaded Wasm files will display as My Stored Codes";
      default:
        return "";
    }
  };
  return (
    <StateContainer>
      <Text color="text.dark">{renderEmptyText()}</Text>
    </StateContainer>
  );
};

const CodeTableHead = () => {
  return (
    <Grid
      templateColumns={TEMPLATE_COLUMNS}
      px="48px"
      sx={{ "& div": { color: "text.dark" } }}
      borderBottom="1px solid"
      borderColor="pebble.700"
    >
      <TableHeaderNoBorder>Code ID</TableHeaderNoBorder>
      <TableHeaderNoBorder>Code Name</TableHeaderNoBorder>
      <TableHeaderNoBorder textAlign="center">Contracts</TableHeaderNoBorder>
      <TableHeaderNoBorder>Uploader</TableHeaderNoBorder>
      <TableHeaderNoBorder>Permission</TableHeaderNoBorder>
    </Grid>
  );
};

const CodeTableRow = ({ code }: CodesRowProps) => {
  const navigate = useInternalNavigate();
  const goToCodeDetails = () => {
    navigate({ pathname: `/code/${code.id}` });
  };

  return (
    <Grid
      templateColumns={TEMPLATE_COLUMNS}
      px="48px"
      _hover={{ bg: "pebble.900" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
      minW="min-content"
      onClick={goToCodeDetails}
      borderBottom="1px solid"
      borderColor="pebble.700"
    >
      <TableRowNoBorder>
        <ExplorerLink
          type="code_id"
          value={code.id.toString()}
          canCopyWithHover
        />
      </TableRowNoBorder>
      <TableRowNoBorder>
        <CodeNameCell code={code} />
      </TableRowNoBorder>
      <TableRowNoBorder>
        <Text
          variant="body2"
          onClick={(e) => e.stopPropagation()}
          cursor="text"
          w="fit-content"
          m="auto"
          px={2}
        >
          {code.contractCount ?? "N/A"}
        </Text>
      </TableRowNoBorder>
      <TableRowNoBorder>
        <ExplorerLink
          value={code.uploader}
          type="user_address"
          canCopyWithHover
        />
      </TableRowNoBorder>
      <TableRowNoBorder>
        <Flex justify="space-between" align="center" w="full">
          <PermissionChip
            instantiatePermission={code.instantiatePermission}
            permissionAddresses={code.permissionAddresses}
          />
          <HStack onClick={(e) => e.stopPropagation()}>
            <InstantiateButton
              instantiatePermission={code.instantiatePermission}
              permissionAddresses={code.permissionAddresses}
              codeId={code.id}
            />
            <SaveOrRemoveCodeModal codeInfo={code} />
          </HStack>
        </Flex>
      </TableRowNoBorder>
    </Grid>
  );
};

const NormalRender = ({
  codes,
  tableName,
}: Pick<CodesTableProps, "codes" | "tableName">) => {
  return (
    <TableContainer mb={20} position="relative">
      <CodeTableHead />
      {codes.map((code) => (
        <CodeTableRow
          key={`row-${tableName}-${code.id}-${code.name}-${code.uploader}`}
          code={code}
        />
      ))}
    </TableContainer>
  );
};

function CodesTable({
  type,
  tableName,
  codes,
  action,
  isSearching,
}: CodesTableProps) {
  const { address } = useWallet();

  const renderBody = () => {
    if (!address && type === "stored") return <Unconnected />;
    if (codes.length === 0 && isSearching) return <NotMatched />;
    if (codes.length === 0) return <Empty type={type} />;
    return <NormalRender codes={codes} tableName={tableName} />;
  };

  return (
    <Box mb={5}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        mb="18px"
        px="48px"
      >
        {type !== "recent" && (
          <Heading as="h6" variant="h6">
            {tableName}
          </Heading>
        )}
        {action}
      </HStack>
      {renderBody()}
    </Box>
  );
}

export default CodesTable;
