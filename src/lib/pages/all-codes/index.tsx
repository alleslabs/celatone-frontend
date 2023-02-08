import { Heading, Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { FilterByPermission } from "lib/components/forms/FilterByPermission";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import type { PermissionFilterValue } from "lib/hooks";
import CodesTable from "lib/pages/codes/components/CodesTable";

import { useAllCodesData } from "./data";

interface AllCodeState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const AllCodes = observer(() => {
  const { watch, setValue } = useForm<AllCodeState>({
    defaultValues: {
      permissionValue: "all",
      keyword: "",
    },
  });
  const { keyword, permissionValue } = watch();
  const { allCodes, isLoading } = useAllCodesData(keyword, permissionValue);

  return (
    <Box>
      <Box p="48px">
        <Heading as="h1" size="lg" mb={4}>
          All Codes
        </Heading>
        <Flex gap={2}>
          <InputWithIcon
            placeholder="Search with code ID or code name"
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("keyword", e.target.value)
            }
            size="lg"
          />
          <FilterByPermission
            initialSelected="all"
            setPermissionValue={(newVal: PermissionFilterValue) => {
              if (newVal === permissionValue) return;
              setValue("permissionValue", newVal);
            }}
          />
        </Flex>
      </Box>
      {isLoading ? (
        <Loading />
      ) : (
        <CodesTable
          type="all"
          tableName="All Codes"
          codes={allCodes}
          isSearching={!!keyword}
        />
      )}
    </Box>
  );
});

export default AllCodes;
