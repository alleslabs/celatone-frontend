import { Box, Grid } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import {
  MobileTableContainer,
  TableContainer,
  TableHeader,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import type { PublicModule } from "lib/types";
import { mergeModulePath } from "lib/utils";

import { PublicProjectModuleMobileCard } from "./PublicProjectModuleMobileCard";
import { PublicProjectModuleRow } from "./PublicProjectModuleRow";

interface PublicProjectModuleTableProps {
  modules: PublicModule[];
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS = "320px 160px minmax(250px, 1fr) 160px";

const ModuleTableHeader = () => (
  <Grid templateColumns={TEMPLATE_COLUMNS} minW="min-content">
    <TableHeader>Module Path</TableHeader>
    <TableHeader>Owner</TableHeader>
    <TableHeader>Module Description</TableHeader>
    <TableHeader />
  </Grid>
);

const ContentRender = ({
  filteredModules,
  isMobile,
}: {
  filteredModules: PublicModule[];
  isMobile: boolean;
}) =>
  isMobile ? (
    <MobileTableContainer>
      {filteredModules.map((module) => (
        <PublicProjectModuleMobileCard
          key={`sm-${mergeModulePath(module.address, module.name)}`}
          module={module}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer mb={4}>
      <ModuleTableHeader />
      {filteredModules.map((module) => (
        <PublicProjectModuleRow
          key={mergeModulePath(module.address, module.name)}
          module={module}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );

export const PublicProjectModuleTable = ({
  modules = [],
  onViewMore,
}: PublicProjectModuleTableProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const isMobile = useMobile();

  const filteredModules = useMemo(() => {
    return onViewMore
      ? modules.slice(0, 5)
      : matchSorter(modules, searchKeyword, {
          keys: ["name", "address", "description"],
          threshold: matchSorter.rankings.CONTAINS,
        });
  }, [modules, onViewMore, searchKeyword]);

  return (
    <Box mt={{ base: 8, md: 12 }} mb={4}>
      <TableTitle title="Modules" count={modules.length} />
      {!onViewMore && (
        <InputWithIcon
          placeholder="Search with Module Address or Module Name"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          size={{ base: "md", md: "lg" }}
          my={2}
          amptrackSection="public-project-module-search"
        />
      )}
      {filteredModules.length ? (
        <ContentRender filteredModules={filteredModules} isMobile={isMobile} />
      ) : (
        <EmptyState
          message={
            modules.length
              ? "No matching module found for this project. Make sure you are searching with Module Address or Module Name"
              : "There are currently no modules related to this project."
          }
          imageVariant={onViewMore && "empty"}
          withBorder
        />
      )}
      {modules.length > 5 && onViewMore && <ViewMore onClick={onViewMore} />}
    </Box>
  );
};
