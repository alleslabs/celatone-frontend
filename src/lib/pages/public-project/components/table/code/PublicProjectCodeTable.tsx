import { TableContainer, Flex, Box, Grid } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { MdSearchOff } from "react-icons/md";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { TableHeaderNoBorder } from "lib/components/table";
import { useCodeStore } from "lib/hooks";
import type { Option, PublicCode, CodeInfo } from "lib/types";

import { PublicProjectCodeRow } from "./PublicProjectCodeRow";

interface PublicProjectCodeTableProps {
  codes: PublicCode[];
  hasSearchInput?: boolean;
}

export interface PublicCodeInfo {
  localInfo: CodeInfo;
  publicInfo: PublicCode;
}

const TEMPLATE_COLUMNS =
  "max(80px) minmax(320px, 1fr) max(120px) max(160px) max(160px) max(250px)";

const CodeTableHeader = () => (
  <Grid
    templateColumns={TEMPLATE_COLUMNS}
    px="32px"
    borderBottom="1px solid"
    borderColor="pebble.700"
  >
    <TableHeaderNoBorder>Code ID</TableHeaderNoBorder>
    <TableHeaderNoBorder>Code Name</TableHeaderNoBorder>
    <TableHeaderNoBorder>Contracts</TableHeaderNoBorder>
    <TableHeaderNoBorder>Uploader</TableHeaderNoBorder>
    <TableHeaderNoBorder>Permission</TableHeaderNoBorder>
    <TableHeaderNoBorder />
  </Grid>
);

export const PublicProjectCodeTable = observer(
  ({ codes = [], hasSearchInput = true }: PublicProjectCodeTableProps) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

    const filteredCodes = useMemo(() => {
      return matchSorter(codes, searchKeyword, {
        keys: ["name", "id"],
        threshold: matchSorter.rankings.CONTAINS,
      });
    }, [codes, searchKeyword]);

    const publicCodes: Option<PublicCodeInfo[]> = filteredCodes?.map(
      (code) => ({
        localInfo: {
          contractCount: code.contractCount,
          instantiatePermission: code.instantiatePermission,
          permissionAddresses: code.permissionAddresses,
          id: code.id,
          uploader: code.uploader,
          isSaved: isCodeIdSaved(code.id),
          ...getCodeLocalInfo(code.id),
        },
        publicInfo: {
          ...code,
        },
      })
    );

    return (
      <Box>
        {hasSearchInput && (
          <Flex px="12">
            <TextInput
              variant="floating"
              value={searchKeyword}
              setInputState={setSearchKeyword}
              placeholder="Search with code ID or code name"
              size="md"
              mb={6}
            />
          </Flex>
        )}
        {!publicCodes.length ? (
          <Flex my={8}>
            <EmptyState message="No contract found." icon={MdSearchOff} />
          </Flex>
        ) : (
          <TableContainer mb={10}>
            <CodeTableHeader />
            {publicCodes.map((code) => (
              <PublicProjectCodeRow
                key={code.publicInfo.id}
                publicCodeInfo={code}
                templateColumn={TEMPLATE_COLUMNS}
              />
            ))}
          </TableContainer>
        )}
      </Box>
    );
  }
);
