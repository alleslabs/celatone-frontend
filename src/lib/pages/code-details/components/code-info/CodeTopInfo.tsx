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
import type { Option } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { getCw2Info } from "lib/utils";

interface CodeTopInfoProps {
  codeDataState: CodeDataState;
  codeId: number;
}

const CodeHashInfo = ({ codeHash }: { codeHash: Option<string> }) => {
  if (!codeHash) {
    return <Spinner size="sm" />;
  }

  return (
    <CopyLink value={codeHash} amptrackSection="code_hash" type="code_hash" />
  );
};

export const CodeTopInfo = ({ codeId, codeDataState }: CodeTopInfoProps) => {
  const { getCodeLocalInfo } = useCodeStore();
  const localCodeInfo = getCodeLocalInfo(codeId);
  const { codeData } = codeDataState;

  const isMobile = useMobile();

  if (!codeData) return <InvalidState title="Code does not exist" />;

  const { info, projectInfo, publicInfo } = codeData;

  const cw2Info = getCw2Info(info?.cw2Contract, info?.cw2Version);

  return (
    <>
      <Breadcrumb
        items={[
          {
            text: projectInfo?.name ? "Public Projects" : "Codes",
            href: projectInfo?.name ? "/projects" : "/codes",
          },
          {
            text: projectInfo?.name,
            href: `/projects/${publicInfo?.slug}`,
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
              {projectInfo && (
                <Image
                  src={projectInfo.logo}
                  borderRadius="full"
                  alt={projectInfo.name}
                  width={7}
                  height={7}
                />
              )}
              <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
                {localCodeInfo?.name ?? publicInfo?.name ?? codeId}
              </Heading>
            </Flex>
          </Flex>
          {publicInfo && (
            <Flex
              mt={{ base: 2, md: 0 }}
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text fontWeight={500} color="text.dark" variant="body2">
                Public Code Name:
              </Text>
              <Text variant="body2">{publicInfo.name}</Text>
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
            {info && <CodeHashInfo codeHash={info.hash} />}
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
          {publicInfo && <GitHubLink github={publicInfo.github} />}
        </Flex>
        <Flex direction="column" gap={1}>
          {!isMobile && info && (
            <CTASection
              id={codeId}
              uploader={localCodeInfo?.uploader ?? info.uploader}
              name={localCodeInfo?.name}
              instantiatePermission={
                info.instantiatePermission ?? AccessConfigPermission.UNKNOWN
              }
              permissionAddresses={info.permissionAddresses ?? []}
              contractCount={undefined}
              cw2Contract={undefined}
              cw2Version={undefined}
            />
          )}
        </Flex>
      </Flex>
      {publicInfo && (
        <PublicDescription
          title="Public Code Description"
          description={publicInfo.description}
          textLine={2}
          icon={<CustomIcon name="public-project" ml={0} color="gray.600" />}
        />
      )}
    </>
  );
};
