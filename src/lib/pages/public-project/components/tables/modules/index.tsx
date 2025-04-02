import type { PublicModule } from "lib/types";

import { Box, Grid } from "@chakra-ui/react";
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
import { mergeModulePath } from "lib/utils";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { PublicProjectModuleMobileCard } from "./PublicProjectModuleMobileCard";
import { PublicProjectModuleRow } from "./PublicProjectModuleRow";

interface PublicProjectModuleTableProps {
  modules: PublicModule[];
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS = "320px 160px minmax(250px, 1fr) 160px";

const ModuleTableHeader = () => (
  <Grid minW="min-content" templateColumns={TEMPLATE_COLUMNS}>
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
    <Box mb={4} mt={{ base: 8, md: 12 }}>
      <TableTitle count={modules.length} title="Modules" />
      {!onViewMore && (
        <InputWithIcon
          amptrackSection="public-project-module-search"
          my={2}
          placeholder="Search with Module Address or Module Name"
          size={{ base: "md", md: "lg" }}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      )}
      {filteredModules.length ? (
        <ContentRender filteredModules={filteredModules} isMobile={isMobile} />
      ) : (
        <EmptyState
          imageVariant={onViewMore && "empty"}
          message={
            modules.length
              ? "No matching module found for this project. Make sure you are searching with Module Address or Module Name"
              : "There are currently no modules related to this project."
          }
          withBorder
        />
      )}
      {modules.length > 5 && onViewMore && <ViewMore onClick={onViewMore} />}
    </Box>
  );
};
