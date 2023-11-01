import { Grid, Box } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state";
import {
  MobileTableContainer,
  TableContainer,
  TableHeader,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import type { Module } from "lib/types";

import { PublicProjectModuleMobileCard } from "./PublicProjectModuleMobileCard";
import { PublicProjectModuleRow } from "./PublicProjectModuleRow";

interface PublicProjectModuleTableProps {
  modules: Module[];
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
  filteredModules: Module[];
  isMobile: boolean;
}) =>
  isMobile ? (
    <MobileTableContainer>
      {filteredModules.map((module) => (
        <PublicProjectModuleMobileCard
          key={`sm-${module.address}::${module.name}`}
          module={module}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer mb={4}>
      <ModuleTableHeader />
      {filteredModules.map((module) => (
        <PublicProjectModuleRow
          key={`${module.address}::${module.name}`}
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
        <TextInput
          variant="fixed-floating"
          value={searchKeyword}
          setInputState={setSearchKeyword}
          placeholder="Search with Module address or Module name"
          size={{ base: "md", md: "lg" }}
          mb={6}
        />
      )}
      {filteredModules.length ? (
        <ContentRender filteredModules={filteredModules} isMobile={isMobile} />
      ) : (
        <EmptyState
          message={
            modules.length
              ? "No matching module found for this project. Make sure you are searching with Account Address or Account Name"
              : "There is currently no modules related to this project."
          }
          imageVariant={onViewMore && "empty"}
          withBorder
        />
      )}
      {modules.length > 5 && onViewMore && <ViewMore onClick={onViewMore} />}
    </Box>
  );
};
