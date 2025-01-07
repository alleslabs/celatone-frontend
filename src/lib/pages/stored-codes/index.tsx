import { Badge, Flex, Heading, Skeleton } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCurrentChain,
  useGovConfig,
  useInternalNavigate,
} from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { MyStoredCodesTable } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";
import { useUploadAccessParamsLcd } from "lib/services/wasm/code";

import { ProposalButton } from "./components/ProposalButton";
import { UploadButton } from "./components/UploadButton";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const StoredCodes = observer(() => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { address } = useCurrentChain();
  const govConfig = useGovConfig({ shouldRedirect: false });

  // TODO refactor to useState
  const { setValue, watch } = useForm<CodeFilterState>({
    defaultValues: {
      keyword: "",
      permissionValue: "all",
    },
  });
  const { keyword, permissionValue } = watch();

  const {
    isStoredCodesLoading,
    storedCodes: stored,
    storedCodesCount,
  } = useMyCodesData(keyword, permissionValue);
  const { data, isFetching: isUploadAccessFetching } =
    useUploadAccessParamsLcd();

  const isAllowed = Boolean(address && data?.addresses?.includes(address));

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_MY_STORED_CODES);
  }, [router.isReady]);

  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });

  return (
    <PageContainer>
      <CelatoneSeo pageName="My Stored Codes" />
      <Flex alignItems="center" mb={4} justifyContent="space-between">
        <Flex align="center">
          <Heading
            alignItems="center"
            as="h5"
            display="flex"
            minH="36px"
            variant="h5"
          >
            My Stored Codes
          </Heading>
          <Badge ml={2} variant="primary">
            {storedCodesCount}
          </Badge>
        </Flex>
        <Flex align="center" gap={4}>
          <UserDocsLink
            isButton
            isDevTool
            href="cosmwasm/codes/organize#viewing-my-stored-codes"
          />
          <Skeleton
            display="flex"
            gap={2}
            borderRadius={8}
            isLoaded={!isUploadAccessFetching}
          >
            {data?.isPermissionedNetwork ? (
              <>
                <UploadButton isAllowed={isAllowed} />
                {govConfig.enabled &&
                  !(
                    govConfig.disableStoreCodeProposal ||
                    govConfig.hideOpenProposal
                  ) && <ProposalButton />}
              </>
            ) : (
              <UploadButton isAllowed />
            )}
          </Skeleton>
        </Flex>
      </Flex>
      <Flex gap={3} my={8}>
        <InputWithIcon
          size="lg"
          value={keyword}
          amptrackSection="stored-code-search"
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
      <MyStoredCodesTable
        emptyMessage="Your uploaded Wasm files will display as My Stored Codes."
        codes={stored}
        disconnectedMessage="to see your previously uploaded and stored codes."
        isLoading={isStoredCodesLoading}
        onRowSelect={onRowSelect}
        totalData={storedCodesCount}
      />
    </PageContainer>
  );
});

export default StoredCodes;
