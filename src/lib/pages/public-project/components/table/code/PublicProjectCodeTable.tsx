import { TableContainer, Flex, Grid, Box } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { TableHeader } from "lib/components/table";
import { TableTitle } from "lib/components/table/TableTitle";
import { ViewMore } from "lib/components/table/ViewMore";
import { useCodeStore } from "lib/hooks";
import type { Option, PublicCode, CodeInfo } from "lib/types";

import { PublicProjectCodeRow } from "./PublicProjectCodeRow";

export interface PublicCodeInfo {
  localInfo: CodeInfo;
  publicInfo: PublicCode;
}

interface PublicProjectCodeTableProps {
  codes: PublicCode[];
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS =
  "max(80px) minmax(320px, 1fr) max(120px) max(160px) max(160px) max(250px)";

const CodeTableHeader = () => (
  <Grid templateColumns={TEMPLATE_COLUMNS}>
    <TableHeader>Code ID</TableHeader>
    <TableHeader>Code Name</TableHeader>
    <TableHeader>Contracts</TableHeader>
    <TableHeader>Uploader</TableHeader>
    <TableHeader>Permission</TableHeader>
    <TableHeader />
  </Grid>
);

export const PublicProjectCodeTable = observer(
  ({ codes = [], onViewMore }: PublicProjectCodeTableProps) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

    const filteredCodes = useMemo(() => {
      return onViewMore
        ? codes.slice(0, 5)
        : matchSorter(codes, searchKeyword, {
            keys: ["name", "id"],
            threshold: matchSorter.rankings.CONTAINS,
          });
    }, [codes, onViewMore, searchKeyword]);

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
      <Box mt={12} mb={4}>
        <TableTitle title="Codes" count={codes.length} />
        {!onViewMore && (
          <TextInput
            variant="floating"
            value={searchKeyword}
            setInputState={setSearchKeyword}
            placeholder="Search with code ID or code name"
            size="md"
            mb={6}
          />
        )}
        {!publicCodes.length ? (
          <Flex
            my={6}
            py={6}
            width="full"
            borderBottom="1px solid"
            borderTop="1px solid"
            borderColor="pebble.700"
          >
            <EmptyState
              message="There is currently no code related to this project."
              imageVariant={onViewMore && "not-found"}
            />
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
            {onViewMore && <ViewMore onClick={onViewMore} />}
          </TableContainer>
        )}
      </Box>
    );
  }
);
