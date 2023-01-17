import { Heading, Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { FilterByPermission } from "lib/components/forms/FilterByPermission";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import CodesTable from "lib/pages/codes/components/CodesTable";

import { useAllCodesData } from "./data";

interface AllCodeState {
  keyword: string;
  permissionValue: string;
}

const AllCodes = observer(() => {
  const { watch, setValue } = useForm<AllCodeState>({
    defaultValues: {
      permissionValue: "all",
      keyword: "",
    },
  });
  const states = watch();
  const { allCodes, isLoading } = useAllCodesData(
    states.keyword,
    states.permissionValue
  );

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue("keyword", inputValue);
  };

  return (
    <Box>
      <Box p="48px">
        <Heading as="h1" size="lg" color="white" mb={4}>
          All Codes
        </Heading>
        <Flex gap={2}>
          <InputWithIcon
            placeholder="Search with code ID or code description"
            value={states.keyword}
            onChange={handleFilterChange}
            size="lg"
          />
          <FilterByPermission
            initialSelected="all"
            setPermissionValue={(newVal: string) =>
              setValue("permissionValue", newVal)
            }
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
          isSearching={!!states.keyword}
        />
      )}
    </Box>
  );
});

export default AllCodes;
