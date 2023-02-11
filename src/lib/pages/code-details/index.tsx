import { Divider, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { BackButton } from "lib/components/button/BackButton";
import { ExplorerLink } from "lib/components/ExplorerLink";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state/InvalidState";
import { useCodeStore } from "lib/hooks";
import { useCodeData } from "lib/model/code";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { InstantiatePermission } from "lib/types";
import { getFirstQueryParam, isCodeId } from "lib/utils";

import { CodeInfoSection } from "./components/CodeInfoSection";
import { CTASection } from "./components/CTASection";
import { ContractTable } from "./components/table/contracts/ContractTable";

interface CodeDetailsBodyProps {
  codeId: number;
}

const InvalidCode = () => <InvalidState title="Code does not exist" />;

const CodeDetailsBody = observer(({ codeId }: CodeDetailsBodyProps) => {
  const { getCodeLocalInfo } = useCodeStore();
  const localCodeInfo = getCodeLocalInfo(codeId);
  const data = useCodeData(codeId);
  if (!data) return <InvalidCode />;

  const { isLoading, codeData, publicProject } = data;
  return (
    <>
      {!isLoading && (
        <>
          <Flex align="center" justify="space-between" mt={6}>
            <Flex direction="column" gap={1}>
              <Flex gap={1}>
                {publicProject.publicDetail?.logo && (
                  <Image
                    src={publicProject.publicDetail.logo}
                    borderRadius="full"
                    alt={publicProject.publicDetail.name}
                    width={7}
                    height={7}
                  />
                )}
                <Heading as="h5" variant="h5">
                  {localCodeInfo?.name ??
                    publicProject.publicCodeData?.name ??
                    codeId}
                </Heading>
              </Flex>
              <Flex gap={2}>
                <Text fontWeight={500} color="text.dark" variant="body2">
                  Code ID
                </Text>
                <ExplorerLink type="code_id" value={codeId.toString()} />
              </Flex>
            </Flex>
            <CTASection
              id={codeId}
              uploader={localCodeInfo?.uploader ?? codeData.uploader}
              name={localCodeInfo?.name}
              instantiatePermission={
                codeData.instantiatePermission ?? InstantiatePermission.UNKNOWN
              }
              permissionAddresses={codeData.permissionAddresses ?? []}
            />
          </Flex>
          <Divider borderColor="pebble.700" my={12} />
          <CodeInfoSection codeData={codeData} />
          <ContractTable codeId={codeId} />
        </>
      )}
    </>
  );
});

const CodeDetails = observer(() => {
  const router = useRouter();
  const codeIdParam = getFirstQueryParam(router.query.codeId);

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_CODE_DETAIL);
  }, [router.isReady]);

  return (
    <PageContainer>
      <BackButton />
      {!isCodeId(codeIdParam) ? (
        <InvalidCode />
      ) : (
        <CodeDetailsBody codeId={Number(codeIdParam)} />
      )}
    </PageContainer>
  );
});

export default CodeDetails;
