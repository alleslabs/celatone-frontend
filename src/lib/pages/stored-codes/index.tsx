import { Heading, Flex, Badge, Skeleton } from "@chakra-ui/react";
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
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";
import { useUploadAccessParams } from "lib/services/proposalService";
import type { Addr } from "lib/types";
import { AccessConfigPermission } from "lib/types";

import { MyStoredCodesSection } from "./components/MyStoredCodesSection";
import { ProposalButton } from "./components/ProposalButton";
import { UploadButton } from "./components/UploadButton";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const StoredCodes = observer(() => {
  const router = useRouter();
  const govConfig = useGovConfig({ shouldRedirect: false });
  const navigate = useInternalNavigate();
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
    storedCodesCount,
    storedCodes: stored,
    isStoredCodesLoading,
  } = useMyCodesData(keyword, permissionValue);

  const isSearching = !!keyword || permissionValue !== "all";

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_MY_STORED_CODES);
  }, [router.isReady]);
  const { data, isFetching: isUploadAccessFetching } = useUploadAccessParams();
  const { address } = useCurrentChain();
  const isAllowed = Boolean(data?.addresses?.includes(address as Addr));

  const isPermissionedNetwork =
    data?.permission !== AccessConfigPermission.EVERYBODY;

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
      <Flex gap={3} pb={4} mt={8}>
        <InputWithIcon
          placeholder="Search with Code ID or Code Name"
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("keyword", e.target.value)
          }
          action="stored-code-search"
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

      <MyStoredCodesSection
        codes={stored}
        isLoading={isStoredCodesLoading}
        onRowSelect={onRowSelect}
        disconnectedMessage="to see your previously uploaded and stored codes."
        isSearching={isSearching}
      />
    </PageContainer>
  );
});

export default StoredCodes;
