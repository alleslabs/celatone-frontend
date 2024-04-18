import { Box, Grid, TableContainer } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import {
  MobileTableContainer,
  TableHeader,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import { useCodeStore } from "lib/providers/store";
import type { CodeInfo, Option, PublicCode } from "lib/types";

import { PublicProjectCodeMobileCard } from "./PublicProjectCodeMobileCard";
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
  "max(100px) minmax(250px, 1fr) minmax(200px, 1fr) max(100px) max(160px) 150px 180px";

const CodeTableHeader = () => (
  <Grid templateColumns={TEMPLATE_COLUMNS} minW="min-content">
    <TableHeader>Code ID</TableHeader>
    <TableHeader>Code Name</TableHeader>
    <TableHeader>CW2 Info</TableHeader>
    <TableHeader textAlign="center">Contracts</TableHeader>
    <TableHeader>Uploader</TableHeader>
    <TableHeader>Permission</TableHeader>
    <TableHeader />
  </Grid>
);

const ContentRender = ({
  publicCodes,
  isMobile,
}: {
  publicCodes: PublicCodeInfo[];
  isMobile: boolean;
}) =>
  isMobile ? (
    <MobileTableContainer>
      {publicCodes.map((code) => (
        <PublicProjectCodeMobileCard
          key={code.publicInfo.id}
          publicCodeInfo={code}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <CodeTableHeader />
      {publicCodes.map((code) => (
        <PublicProjectCodeRow
          key={code.publicInfo.id}
          publicCodeInfo={code}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
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
    const isMobile = useMobile();
    const publicCodes: Option<PublicCodeInfo[]> = filteredCodes?.map(
      (code) => ({
        localInfo: {
          contractCount: code.contractCount,
          instantiatePermission: code.instantiatePermission,
          permissionAddresses: code.permissionAddresses,
          id: code.id,
          uploader: code.uploader,
          cw2Contract: code.cw2Contract,
          cw2Version: code.cw2Version,
          isSaved: isCodeIdSaved(code.id),
          ...getCodeLocalInfo(code.id),
        },
        publicInfo: {
          ...code,
        },
      })
    );

    return (
      <Box mt={{ base: 8, md: 12 }} mb={4}>
        <TableTitle title="Codes" count={codes.length} />
        {!onViewMore && (
          <InputWithIcon
            placeholder="Search with Code ID or Code Name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            size={{ base: "md", md: "lg" }}
            my={2}
            amptrackSection="public-project-code-search"
          />
        )}
        {publicCodes.length ? (
          <ContentRender publicCodes={publicCodes} isMobile={isMobile} />
        ) : (
          <EmptyState
            message={
              codes.length
                ? "No matching codes found for this project. Make sure you are searching with Code ID or Code Name"
                : "There are currently no codes related to this project."
            }
            imageVariant={codes.length ? "not-found" : "empty"}
            withBorder
          />
        )}
        {codes.length > 5 && onViewMore && <ViewMore onClick={onViewMore} />}
      </Box>
    );
  }
);
