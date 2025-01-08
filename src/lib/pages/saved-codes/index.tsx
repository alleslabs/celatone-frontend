import { Badge, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { MySavedCodesTable } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";

import { SaveCodeButton } from "./components/SaveCodeButton";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const SavedCodes = observer(() => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });
  // TODO refactor to useState
  const { setValue, watch } = useForm<CodeFilterState>({
    defaultValues: {
      keyword: "",
      permissionValue: "all",
    },
  });
  const { keyword, permissionValue } = watch();

  const {
    isSavedCodesLoading,
    savedCodes: saved,
    savedCodesCount,
  } = useMyCodesData(keyword, permissionValue);

  useEffect(() => {
    if (router.isReady && isSavedCodesLoading) {
      track(AmpEvent.TO_MY_SAVED_CODES, { savedCodesCount });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, isSavedCodesLoading]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Saved Codes" />
      <Flex alignItems="center" mb={4} justifyContent="space-between">
        <Flex direction="column">
          <Flex align="center">
            <Heading
              alignItems="center"
              as="h5"
              display="flex"
              minH="36px"
              variant="h5"
            >
              Saved Codes
            </Heading>
            <Badge ml={2} variant="primary">
              {savedCodesCount}
            </Badge>
          </Flex>
          <Text variant="body2" color="text.dark">
            Your saved codes will be stored locally
          </Text>
        </Flex>
        <SaveCodeButton />
      </Flex>
      <Flex gap={3} my={8}>
        <InputWithIcon
          size="lg"
          value={keyword}
          amptrackSection="saved-code-search"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("keyword", e.target.value)
          }
          placeholder="Search with Code ID or Code Name"
        />
        <FilterByPermission
          initialSelected="all"
          setPermissionValue={(newVal: PermissionFilterValue) => {
            if (newVal === permissionValue) return;
            setValue("permissionValue", newVal);
          }}
        />
      </Flex>
      <MySavedCodesTable
        codes={saved}
        isLoading={isSavedCodesLoading}
        onRowSelect={onRowSelect}
        totalData={savedCodesCount}
      />
      <UserDocsLink
        cta="Read more about Saved Codes"
        title="How to organize and save codes?"
        isDevTool
        href="cosmwasm/codes/organize#saving-code-for-later-use"
      />
    </PageContainer>
  );
});

export default SavedCodes;
