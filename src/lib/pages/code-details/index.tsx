import { Divider, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { BackButton } from "lib/components/button";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { GitHubLink } from "lib/components/links";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { PublicDescription } from "lib/components/PublicDescription";
import { InvalidState } from "lib/components/state";
import type { CodeDataState } from "lib/model/code";
import { useCodeData } from "lib/model/code";
import { useCodeStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { AccessConfigPermission } from "lib/types";
import { getCw2Info, getFirstQueryParam, isCodeId } from "lib/utils";

import { CodeInfoSection } from "./components/CodeInfoSection";
import { CTASection } from "./components/CTASection";
import { CodeContractsTable } from "./components/table/CodeContractsTable";

interface CodeDetailsBodyProps {
  codeDataState: CodeDataState;
  codeId: number;
}

const InvalidCode = () => <InvalidState title="Code does not exist" />;

const CodeDetailsBody = observer(
  ({ codeDataState, codeId }: CodeDetailsBodyProps) => {
    const { getCodeLocalInfo } = useCodeStore();
    const localCodeInfo = getCodeLocalInfo(codeId);
    const { chainId, codeData, publicProject } = codeDataState;

    if (!codeData) return <InvalidCode />;

    const cw2Info = getCw2Info(codeData.cw2Contract, codeData.cw2Version);

    return (
      <>
        <Flex justify="space-between" mt={6}>
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
            {publicProject.publicCodeData?.name && (
              <Flex gap={2}>
                <Text fontWeight={500} color="text.dark" variant="body2">
                  Public Code Name:
                </Text>
                <Text variant="body2">{publicProject.publicCodeData.name}</Text>
              </Flex>
            )}
            <Flex gap={2}>
              <Text fontWeight={500} color="text.dark" variant="body2">
                Code ID:
              </Text>
              <CopyLink
                value={codeId.toString()}
                amptrackSection="code_top"
                type="code_id"
              />
            </Flex>
            <Flex gap={2}>
              <Text fontWeight={500} color="text.dark" variant="body2">
                CW2 Info:
              </Text>
              <Text
                color={cw2Info ? "text.main" : "text.disabled"}
                variant="body2"
                wordBreak="break-all"
              >
                {cw2Info ?? "N/A"}
              </Text>
            </Flex>
            {publicProject.publicCodeData?.github && (
              <GitHubLink github={publicProject.publicCodeData.github} />
            )}
          </Flex>
          <CTASection
            id={codeId}
            uploader={localCodeInfo?.uploader ?? codeData.uploader}
            name={localCodeInfo?.name}
            instantiatePermission={
              codeData.instantiatePermission ?? AccessConfigPermission.UNKNOWN
            }
            permissionAddresses={codeData.permissionAddresses ?? []}
            contractCount={undefined}
            cw2Contract={undefined}
            cw2Version={undefined}
          />
        </Flex>
        {publicProject.publicCodeData?.description && (
          <PublicDescription
            title="Public Code Description"
            description={publicProject.publicCodeData.description}
            textLine={2}
            icon={
              <CustomIcon name="website" ml="0" mb="6px" color="gray.600" />
            }
          />
        )}
        <Divider borderColor="gray.700" my={12} />
        <CodeInfoSection codeData={codeData} chainId={chainId} />
        <CodeContractsTable codeId={codeId} />
      </>
    );
  }
);

const CodeDetails = observer(() => {
  const router = useRouter();
  const codeIdParam = getFirstQueryParam(router.query.codeId);
  const data = useCodeData(Number(codeIdParam));

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_CODE_DETAIL);
  }, [router.isReady]);

  if (data.isLoading) return <Loading />;
  return (
    <PageContainer>
      <BackButton />
      {!isCodeId(codeIdParam) ? (
        <InvalidCode />
      ) : (
        <CodeDetailsBody codeDataState={data} codeId={Number(codeIdParam)} />
      )}
    </PageContainer>
  );
});

export default CodeDetails;
