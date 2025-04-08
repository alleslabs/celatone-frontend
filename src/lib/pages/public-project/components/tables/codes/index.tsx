import type { WasmVerifyInfosResponse } from "lib/services/types";
import type { CodeInfo, Option, PublicCode } from "lib/types";

import { Box, Grid, TableContainer } from "@chakra-ui/react";
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
import { useWasmVerifyInfos } from "lib/services/verification/wasm";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

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
  <Grid minW="min-content" templateColumns={TEMPLATE_COLUMNS}>
    <TableHeader>Code ID</TableHeader>
    <TableHeader>Code name</TableHeader>
    <TableHeader>CW2 info</TableHeader>
    <TableHeader textAlign="center">Contracts</TableHeader>
    <TableHeader>Uploader</TableHeader>
    <TableHeader>Permission</TableHeader>
    <TableHeader />
  </Grid>
);

const ContentRender = ({
  publicCodes,
  wasmVerifyInfos,
  isMobile,
}: {
  publicCodes: PublicCodeInfo[];
  wasmVerifyInfos: Option<WasmVerifyInfosResponse>;
  isMobile: boolean;
}) =>
  isMobile ? (
    <MobileTableContainer>
      {publicCodes.map((code) => (
        <PublicProjectCodeMobileCard
          key={code.publicInfo.id}
          publicCodeInfo={code}
          wasmVerifyInfo={wasmVerifyInfos?.[code.localInfo.id]}
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
          wasmVerifyInfo={wasmVerifyInfos?.[code.localInfo.id]}
        />
      ))}
    </TableContainer>
  );

export const PublicProjectCodeTable = observer(
  ({ codes = [], onViewMore }: PublicProjectCodeTableProps) => {
    const isMobile = useMobile();
    const [searchKeyword, setSearchKeyword] = useState("");
    const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

    const { data: wasmVerifyInfos } = useWasmVerifyInfos(
      codes.map((code) => code.id),
      !!codes
    );

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
      <Box mb={4} mt={{ base: 8, md: 12 }}>
        <TableTitle count={codes.length} title="Codes" />
        {!onViewMore && (
          <InputWithIcon
            amptrackSection="public-project-code-search"
            my={2}
            placeholder="Search with code ID or code name"
            size={{ base: "md", md: "lg" }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        )}
        {publicCodes.length ? (
          <ContentRender
            isMobile={isMobile}
            publicCodes={publicCodes}
            wasmVerifyInfos={wasmVerifyInfos}
          />
        ) : (
          <EmptyState
            imageVariant={codes.length ? "not-found" : "empty"}
            message={
              codes.length
                ? "No matching codes found for this project. Make sure you are searching with Code ID or Code Name"
                : "There are currently no codes related to this project."
            }
            withBorder
          />
        )}
        {codes.length > 5 && onViewMore && <ViewMore onClick={onViewMore} />}
      </Box>
    );
  }
);
