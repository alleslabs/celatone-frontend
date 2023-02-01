import { Heading, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import CodesTable from "lib/pages/codes/components/CodesTable";

import { useAllCodesData } from "./data";

const AllCodes = observer(() => {
  const [keyword, setKeyword] = useState("");
  const { allCodes, isLoading } = useAllCodesData(keyword);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeyword(inputValue);
  };

  return (
    <Box>
      <Box p="48px">
        <Heading as="h1" size="lg" mb={4}>
          All Codes
        </Heading>

        <InputWithIcon
          placeholder="Search with code ID or code description"
          value={keyword}
          onChange={handleFilterChange}
          size="lg"
        />
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
