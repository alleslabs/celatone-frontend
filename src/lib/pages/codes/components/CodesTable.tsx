import {
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  TableContainer,
  Heading,
  HStack,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { MdSearchOff } from "react-icons/md";

import { ConnectWalletBtn } from "lib/components/button/ConnectWallet";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { RemoveCode } from "lib/components/modal/code/RemoveCode";
import type { CodeInfo } from "lib/types";

import { CodeDescriptionCell } from "./CodeDescriptionCell";

type TableType = "stored" | "saved";
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
      <Text color="text.dark">
        Connect your wallet to upload and see your stored Codes.
      </Text>
      <ConnectWalletBtn />
    </StateContainer>
  );
};

const Empty = ({ type }: OtherTBodyProps) => {
  return (
    <StateContainer>
      {type === "saved" ? (
        <Text color="text.dark">
          Your saved Code ID will display here. Saved Codes are stored in your
          device.
        </Text>
      ) : (
        <Text color="text.dark">
          Your uploaded Wasm files will display as My Stored Codes
        </Text>
      )}
    </StateContainer>
  );
};

const TableHead = () => {
  return (
    <Thead borderBottom="1px solid #2E2E2E">
      <Tr
        sx={{
          "> th": {
            padding: "16px",
            textTransform: "capitalize",
          },
        }}
      >
        <Th width="10%">Code ID</Th>
        <Th width="45%">Code Description</Th>
        <Th width="10%" textAlign="center">
          Contracts
        </Th>
        <Th width="15%">Uploader</Th>
        <Th width="20%" />
      </Tr>
    </Thead>
  );
};

const TableRow = ({ code, isRemovable }: CodesRowProps) => {
  const router = useRouter();
  const { address } = useWallet();

  const goToInstantiate = () => {
    router.push({ pathname: "/instantiate", query: { "code-id": code.id } });
  };

  return (
    <Tr
      borderBottom="1px solid #2E2E2E"
      sx={{ "> td": { padding: "16px" } }}
      _hover={{
        bg: "gray.900",
      }}
    >
      <Td width="10%" color="primary.main">
        <ExplorerLink value={code.id.toString()} canCopyWithHover />
      </Td>
      <Td width="45%">
        <CodeDescriptionCell codeId={code.id} description={code.description} />
      </Td>
      <Td width="10%" textAlign="center">
        {code.contracts}
      </Td>
      <Td width="15%">
        {address && code.uploader === address ? (
          "Me"
        ) : (
          <ExplorerLink
            value={code.uploader}
            type="user_address"
            canCopyWithHover
          />
        )}
      </Td>
      <Td width="20%">
        <HStack>
          <Button variant="outline-gray" size="sm" onClick={goToInstantiate}>
            Instantiate
          </Button>
          {isRemovable && <RemoveCode codeId={code.id} />}
        </HStack>
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

  const renderBodyStored = () => {
    if (!address) return <Unconnected />;
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

  const renderBodySaved = () => {
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
      <HStack alignItems="center" justifyContent="space-between" mb="18px">
        <Heading as="h2" size="md" color="white">
          {tableName}
        </Heading>
        {action}
      </HStack>
      {type === "saved" ? renderBodySaved() : renderBodyStored()}
    </Box>
  );
}

export default CodesTable;
