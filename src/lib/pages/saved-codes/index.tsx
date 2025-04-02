import type { PermissionFilterValue } from "lib/hooks";
import type { ChangeEvent } from "react";

import { Badge, Flex, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import {
  useInternalNavigate,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { MySavedCodesTable } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useMyCodesData } from "lib/model/code";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { SaveCodeButton } from "./components/SaveCodeButton";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const SavedCodes = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { isFullTier } = useTierConfig();

  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });
  // TODO refactor to useState
  const { watch, setValue } = useForm<CodeFilterState>({
    defaultValues: {
      permissionValue: "all",
      keyword: "",
    },
  });
  const { keyword, permissionValue } = watch();

  const {
    savedCodesCount,
    savedCodes: saved,
    isSavedCodesLoading,
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
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
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
          <Text color="text.dark" variant="body2">
            Your saved codes will be stored locally
          </Text>
        </Flex>
        <SaveCodeButton />
      </Flex>
      <Flex gap={3} my={8}>
        <InputWithIcon
          amptrackSection="saved-code-search"
          placeholder="Search with Code ID or Code Name"
          size="lg"
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("keyword", e.target.value)
          }
        />
        {isFullTier && (
          <FilterByPermission
            initialSelected="all"
            setPermissionValue={(newVal: PermissionFilterValue) => {
              if (newVal === permissionValue) return;
              setValue("permissionValue", newVal);
            }}
          />
        )}
      </Flex>
      <MySavedCodesTable
        codes={saved}
        disablePermission={!isFullTier}
        isLoading={isSavedCodesLoading}
        showCw2andContracts={isFullTier}
        totalData={savedCodesCount}
        onRowSelect={onRowSelect}
      />
      <UserDocsLink
        cta="Read more about Saved Codes"
        href="cosmwasm/codes/organize#saving-code-for-later-use"
        isDevTool
        title="How to organize and save codes?"
      />
    </PageContainer>
  );
});

export default SavedCodes;
