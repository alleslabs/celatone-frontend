import { Flex, Heading, Image, Spinner, Text } from "@chakra-ui/react";

import { CTASection } from "../CTASection";
import { useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { GitHubLink } from "lib/components/links";
import { PublicDescription } from "lib/components/PublicDescription";
import { InvalidState } from "lib/components/state";
import type { CodeDataState } from "lib/model/code";
import { useCodeStore } from "lib/providers/store";
import { AccessConfigPermission, type Option } from "lib/types";
import { getCw2Info } from "lib/utils";

interface CodeTopInfoProps {
  codeDataState: CodeDataState;
  codeId: number;
}
const CodeHashInfo = ({
  isLcdCodeLoading,
  isLcdCodeError,
  codeHash,
}: {
  isLcdCodeLoading: boolean;
  isLcdCodeError: unknown;
  codeHash: Option<string>;
}) => {
  if (isLcdCodeLoading) return <Spinner size="sm" />;
  if (codeHash)
    return (
      <CopyLink value={codeHash} amptrackSection="code_hash" type="code_hash" />
    );
  return (
    <Text color="text.disabled" variant="body2">
      {isLcdCodeError ? "Error fetching data" : "N/A"}
    </Text>
  );
};

export const CodeTopInfo = ({ codeId, codeDataState }: CodeTopInfoProps) => {
  const { getCodeLocalInfo } = useCodeStore();
  const localCodeInfo = getCodeLocalInfo(codeId);
  const {
    codeData,
    publicProject,
    lcdCodeData: { codeHash, isLcdCodeLoading, isLcdCodeError },
  } = codeDataState;

  const isMobile = useMobile();

  if (!codeData) return <InvalidState title="Code does not exist" />;

  const cw2Info = getCw2Info(codeData.cw2Contract, codeData.cw2Version);

  return (
    <>
      <Breadcrumb
        items={[
          {
            text: publicProject.publicCodeData?.name
              ? "Public Projects"
              : "Codes",
            href: publicProject.publicCodeData?.name ? "/projects" : "/codes",
          },
          {
            text: publicProject.publicDetail?.name,
            href: `/projects/${publicProject.publicCodeData?.slug}`,
          },
          { text: codeId.toString() },
        ]}
      />
      <Flex
        justify="space-between"
        my={{ base: 3, md: 6 }}
        direction={{ base: "column", md: "row" }}
      >
        <Flex direction="column" gap={{ base: 2, md: 1 }}>
          <Flex justify={{ base: "space-between", md: "start" }} align="center">
            <Flex gap={1} minH="36px" align="center">
              <CustomIcon name="code" boxSize={5} color="secondary.main" />
              {publicProject.publicDetail?.logo && (
                <Image
                  src={publicProject.publicDetail.logo}
                  borderRadius="full"
                  alt={publicProject.publicDetail.name}
                  width={7}
                  height={7}
                />
              )}
              <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
                {localCodeInfo?.name ??
                  publicProject.publicCodeData?.name ??
                  codeId}
              </Heading>
            </Flex>
          </Flex>
          {publicProject.publicCodeData?.name && (
            <Flex
              mt={{ base: 2, md: 0 }}
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text fontWeight={500} color="text.dark" variant="body2">
                Public Code Name:
              </Text>
              <Text variant="body2">{publicProject.publicCodeData.name}</Text>
            </Flex>
          )}
          <Flex
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text fontWeight={500} color="text.dark" variant="body2">
              Code ID:
            </Text>
            <CopyLink
              value={codeId.toString()}
              amptrackSection="code_top"
              type="code_id"
            />
          </Flex>
          <Flex
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text fontWeight={500} color="text.dark" variant="body2">
              Code Hash:
            </Text>
            <CodeHashInfo
              isLcdCodeError={isLcdCodeError}
              isLcdCodeLoading={isLcdCodeLoading}
              codeHash={codeHash}
            />
          </Flex>
          <Flex
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
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
        <Flex direction="column" gap={1}>
          {!isMobile && (
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
          )}
        </Flex>
      </Flex>
      {publicProject.publicCodeData?.description && (
        <PublicDescription
          title="Public Code Description"
          description={publicProject.publicCodeData.description}
          textLine={2}
          icon={<CustomIcon name="public-project" ml={0} color="gray.600" />}
        />
      )}
    </>
  );
};
