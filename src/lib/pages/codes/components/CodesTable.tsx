import {
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  HStack,
  VStack,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { ReactNode } from "react";
import { MdSearchOff } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { InstantiateButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { RemoveCode } from "lib/components/modal/code/RemoveCode";
import { SaveOrRemoveCode } from "lib/components/modal/code/SaveOrRemoveCode";
import { PermissionChip } from "lib/components/PermissionChip";
import { DisconnectedState } from "lib/components/state/DisconnectedState";
import type { CodeInfo } from "lib/types";

import { CodeDescriptionCell } from "./CodeDescriptionCell";

// Types of Table: All Codes / My Stored Codes / My Saved Codes
type TableType = "all" | "stored" | "saved";

interface CodesTableProps {
  type: TableType;
  tableName: string;
  codes: CodeInfo[];
  action?: ReactNode;
  isRemovable?: boolean;
  isSearching: boolean;
}

interface CodesRowProps {
  code: CodeInfo;
  isRemovable: boolean;
}

interface OtherTBodyProps {
  type: TableType;
}

const StateContainer = ({ children }: { children: ReactNode }) => (
  <VStack
    borderTopWidth={1}
    borderBottomWidth={1}
    minH="128px"
    justifyContent="center"
    gap={2}
  >
    {children}
  </VStack>
);

const NotMatched = () => {
  return (
    <StateContainer>
      <Icon as={MdSearchOff} width="64px" height="64px" color="gray.600" />
      <Text color="text.dark">No matched codes found.</Text>
    </StateContainer>
  );
};

const Unconnected = () => {
  return (
    <StateContainer>
      <DisconnectedState text="to upload and see your stored Codes." />
    </StateContainer>
  );
};

const Empty = ({ type }: OtherTBodyProps) => {
  const renderEmptyText = () => {
    switch (type) {
      case "all":
        return "All Code IDs will display here";
      case "saved":
        return "Your saved Code IDs will display here. Saved Codes are stored in your device.";
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

const TableHead = () => {
  return (
    <Thead borderBottom="1px solid #2E2E2E">
      <Tr
        sx={{
          "& th:first-of-type": { pl: "48px" },
          "> th": {
            padding: "16px",
            textTransform: "capitalize",
          },
        }}
      >
        <Th width="10%">Code ID</Th>
        <Th width="35%">Code Description</Th>
        <Th width="10%" textAlign="center">
          Contracts
        </Th>
        <Th width="15%">Uploader</Th>
        <Th width="30%">Permission</Th>
      </Tr>
    </Thead>
  );
};

const TableRow = ({ code, isRemovable }: CodesRowProps) => {
  const navigate = useInternalNavigate();
  const goToCodeDetails = () => {
    navigate({ pathname: `/code/${code.id}` });
  };

  return (
    <Tr
      borderBottom="1px solid #2E2E2E"
      sx={{
        "& td:first-of-type": { pl: "48px" },
        "& td:last-of-type": { pr: "48px" },
        "> td": { padding: "16px" },
      }}
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      onClick={goToCodeDetails}
    >
      <Td width="10%" color="primary.main">
        <ExplorerLink
          type="code_id"
          value={code.id.toString()}
          canCopyWithHover
        />
      </Td>
      <Td width="35%">
        <CodeDescriptionCell code={code} />
      </Td>
      <Td width="10%" textAlign="center">
        <Text
          variant="body2"
          onClick={(e) => e.stopPropagation()}
          cursor="text"
          w="fit-content"
          m="auto"
          px={2}
        >
          {code.contracts}
        </Text>
      </Td>
      <Td width="15%">
        <ExplorerLink
          value={code.uploader}
          type="user_address"
          canCopyWithHover
        />
      </Td>
      <Td width="30%">
        <Flex justify="space-between" align="center">
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
            {isRemovable ? (
              <RemoveCode codeId={code.id} description={code.description} />
            ) : (
              <SaveOrRemoveCode codeInfo={code} />
            )}
          </HStack>
        </Flex>
      </Td>
    </Tr>
  );
};

const NormalRender = ({
  codes,
  tableName,
  isRemovable = false,
}: Pick<CodesTableProps, "codes" | "tableName" | "isRemovable">) => {
  return (
    <TableContainer width="100%" mb="20">
      <Table variant="unstyled">
        <TableHead />
        <Tbody>
          {codes.map((code) => (
            <TableRow
              key={`row-${tableName}-${code.id}-${code.description}-${code.uploader}`}
              code={code}
              isRemovable={isRemovable}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

function CodesTable({
  type,
  tableName,
  codes,
  action,
  isRemovable,
  isSearching,
}: CodesTableProps) {
  const { address } = useWallet();

  const renderBody = () => {
    if (!address && type === "stored") return <Unconnected />;
    if (codes.length === 0 && isSearching) return <NotMatched />;
    if (codes.length === 0) return <Empty type={type} />;
    return (
      <NormalRender
        isRemovable={isRemovable}
        codes={codes}
        tableName={tableName}
      />
    );
  };

  return (
    <Box mb={5}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        mb="18px"
        px="48px"
      >
        {type !== "all" && (
          <Heading as="h2" size="md" color="white">
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
