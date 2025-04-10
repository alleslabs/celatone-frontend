import type { PermissionFilterValue } from "lib/hooks";
import type { ChangeEvent } from "react";

import { Badge, Flex, Heading, Skeleton } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCurrentChain,
  useGovConfig,
  useInternalNavigate,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { MyStoredCodesTable } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useMyCodesData } from "lib/model/code";
import { useUploadAccessParamsRest } from "lib/services/wasm/code";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ProposalButton } from "./components/ProposalButton";
import { UploadButton } from "./components/UploadButton";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const StoredCodes = observer(() => {
  useTierConfig({ minTier: "full" });
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { address } = useCurrentChain();
  const govConfig = useGovConfig({ shouldRedirect: false });

  // TODO refactor to useState
  const { watch, setValue } = useForm<CodeFilterState>({
    defaultValues: {
      permissionValue: "all",
      keyword: "",
    },
  });
  const { keyword, permissionValue } = watch();

  const {
    storedCodesCount,
    storedCodes: stored,
    isStoredCodesLoading,
  } = useMyCodesData(keyword, permissionValue);
  const { data, isFetching: isUploadAccessFetching } =
    useUploadAccessParamsRest();

  const isAllowed = Boolean(
    address && data?.codeUploadAccess.addresses?.includes(address)
  );

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
      <CelatoneSeo pageName="My stored codes" />
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Flex align="center">
          <Heading
            alignItems="center"
            as="h5"
            display="flex"
            minH="36px"
            variant="h5"
          >
            My stored codes
          </Heading>
          <Badge ml={2} variant="primary">
            {storedCodesCount}
          </Badge>
        </Flex>
        <Flex align="center" gap={4}>
          <UserDocsLink
            href="cosmwasm/codes/organize#viewing-my-stored-codes"
            isButton
            isDevTool
          />
          <Skeleton
            borderRadius={8}
            display="flex"
            gap={2}
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
          amptrackSection="stored-code-search"
          placeholder="Search with code ID or code name"
          size="lg"
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("keyword", e.target.value)
          }
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
        codes={stored}
        disconnectedMessage="to see your previously uploaded and stored codes."
        emptyMessage="Your uploaded Wasm files will display as My Stored Codes."
        isLoading={isStoredCodesLoading}
        totalData={storedCodesCount}
        onRowSelect={onRowSelect}
      />
    </PageContainer>
  );
});

export default StoredCodes;
