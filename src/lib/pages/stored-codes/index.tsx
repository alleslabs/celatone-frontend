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
import { MyStoredCodesTable } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";
import { useUploadAccessParams } from "lib/services/proposal";
import { AccessConfigPermission } from "lib/types";

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
  const { data, isFetching: isUploadAccessFetching } = useUploadAccessParams();

  const isPermissionedNetwork =
    data?.permission !== AccessConfigPermission.EVERYBODY;
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
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Flex align="center">
          <Heading
            variant="h5"
            as="h5"
            minH="36px"
            display="flex"
            alignItems="center"
          >
            My Stored Codes
          </Heading>
          <Badge variant="primary" ml={2}>
            {storedCodesCount}
          </Badge>
        </Flex>
        <Flex gap={4} align="center">
          <UserDocsLink
            isDevTool
            href="cosmwasm/codes/organize#viewing-my-stored-codes"
            isButton
          />
          <Skeleton
            isLoaded={!isUploadAccessFetching}
            display="flex"
            gap={2}
            borderRadius={8}
          >
            {isPermissionedNetwork ? (
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
          placeholder="Search with Code ID or Code Name"
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("keyword", e.target.value)
          }
          size="lg"
          amptrackSection="stored-code-search"
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
        totalData={storedCodesCount}
        isLoading={isStoredCodesLoading}
        onRowSelect={onRowSelect}
        emptyMessage="Your uploaded Wasm files will display as My Stored Codes."
        disconnectedMessage="to see your previously uploaded and stored codes."
      />
    </PageContainer>
  );
});

export default StoredCodes;
