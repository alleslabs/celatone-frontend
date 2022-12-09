import { Heading, Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import CodesTable from "lib/pages/codes/components/CodesTable";
import CustomTab from "lib/pages/codes/components/CustomTab";

import SaveCodeButton from "./components/SaveCodeButton";
import UploadButton from "./components/UploadButton";
import { useCodeListData } from "./data";

const Codes = observer(() => {
  const [keyword, setKeyword] = useState("");
  const {
    storedCodesCount,
    storedCodes: stored,
    savedCodesCount,
    savedCodes: saved,
    allCodesCount,
  } = useCodeListData(keyword);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    setKeyword(inputValue);
  };

  return (
    <PageContainer>
      <Heading as="h1" size="lg" color="white" mb={4}>
        Code Lists
      </Heading>

      <Tabs>
        <TabList border="none" mb="32px">
          <CustomTab codeCount={allCodesCount}>All Codes</CustomTab>
          <CustomTab codeCount={storedCodesCount}>My Stored Codes</CustomTab>
          <CustomTab codeCount={savedCodesCount}>My Saved Codes </CustomTab>
        </TabList>
        <InputWithIcon
          placeholder="Search with Code ID or Code Description"
          value={keyword}
          onChange={handleFilterChange}
        />
        <TabPanels mt="48px">
          <TabPanel p="0px">
            <CodesTable
              type="stored"
              tableName="My Stored Codes"
              codes={stored}
              action={<UploadButton />}
              isSearching={!!keyword}
            />
            <CodesTable
              type="saved"
              tableName="My Saved Codes"
              codes={saved}
              action={<SaveCodeButton />}
              isRemovable
              isSearching={!!keyword}
            />
          </TabPanel>
          <TabPanel p="0px">
            <CodesTable
              type="stored"
              tableName="My Stored Codes"
              codes={stored}
              action={<UploadButton />}
              isSearching={!!keyword}
            />
          </TabPanel>
          <TabPanel p="0px">
            <CodesTable
              type="saved"
              tableName="My Saved Codes"
              codes={saved}
              action={<SaveCodeButton />}
              isSearching={!!keyword}
              isRemovable
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
});

export default Codes;
