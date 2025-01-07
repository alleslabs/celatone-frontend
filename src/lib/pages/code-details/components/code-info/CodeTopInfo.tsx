import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { CtaSection } from "../CtaSection";
import { useMobile, useTierConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { GitHubLink } from "lib/components/links";
import { PublicDescription } from "lib/components/PublicDescription";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { useCodeStore } from "lib/providers/store";
import type { Code } from "lib/services/types";
import type {
  Nullable,
  Nullish,
  ProjectInfo,
  PublicCodeInfo,
  WasmVerifyInfo,
} from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";

interface CodeTopInfoProps {
  code: Code;
  codeId: number;
  projectInfo: Nullable<ProjectInfo>;
  publicInfo: Nullable<PublicCodeInfo>;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CodeTopInfo = observer(
  ({
    code,
    codeId,
    projectInfo,
    publicInfo,
    wasmVerifyInfo,
  }: CodeTopInfoProps) => {
    const isMobile = useMobile();
    const { isFullTier } = useTierConfig();

    const { getCodeLocalInfo } = useCodeStore();
    const localCodeInfo = getCodeLocalInfo(codeId);

    const cw2Info = getCw2Info(code.cw2Contract, code.cw2Version);
    return (
      <>
        <Breadcrumb
          items={[
            {
              href: projectInfo?.name ? "/projects" : "/codes",
              text: projectInfo?.name ? "Public Projects" : "Codes",
            },
            {
              href: `/projects/${publicInfo?.slug}`,
              text: projectInfo?.name,
            },
            { text: codeId.toString() },
          ]}
        />
        <Flex
          justify="space-between"
          my={{ base: 3, md: 6 }}
          direction={{ base: "column", md: "row" }}
        >
          <Flex gap={{ base: 2, md: 1 }} direction="column">
            <Flex
              align="center"
              justify={{ base: "space-between", md: "start" }}
            >
              <Flex align="center" gap={1} minH="36px">
                <CustomIcon name="code" boxSize={5} color="primary.main" />
                {projectInfo && (
                  <Image
                    width={7}
                    alt={projectInfo.name}
                    height={7}
                    src={projectInfo.logo}
                    borderRadius="full"
                  />
                )}
                <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
                  {localCodeInfo?.name ?? publicInfo?.name ?? codeId}
                </Heading>
                <WasmVerifyBadge
                  status={getWasmVerifyStatus(wasmVerifyInfo)}
                  relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                />
              </Flex>
            </Flex>
            {publicInfo && (
              <Flex
                gap={{ base: 0, md: 2 }}
                mt={{ base: 2, md: 0 }}
                direction={{ base: "column", md: "row" }}
              >
                <Text variant="body2" color="text.dark" fontWeight={500}>
                  Public Code Name:
                </Text>
                <Text variant="body2">{publicInfo.name}</Text>
              </Flex>
            )}
            <Flex
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text variant="body2" color="text.dark" fontWeight={500}>
                Code ID:
              </Text>
              <CopyLink
                type="code_id"
                value={codeId.toString()}
                amptrackSection="code_top"
              />
            </Flex>
            <Flex
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text variant="body2" color="text.dark" fontWeight={500}>
                Code Hash:
              </Text>
              <CopyLink
                type="code_hash"
                value={code.hash.toUpperCase()}
                amptrackSection="code_hash"
              />
            </Flex>
            {isFullTier && (
              <Flex
                gap={{ base: 0, md: 2 }}
                direction={{ base: "column", md: "row" }}
              >
                <Text variant="body2" color="text.dark" fontWeight={500}>
                  CW2 Info:
                </Text>
                <Text
                  variant="body2"
                  color={cw2Info ? "text.main" : "text.disabled"}
                  wordBreak="break-all"
                >
                  {cw2Info ?? "N/A"}
                </Text>
              </Flex>
            )}
            {publicInfo && <GitHubLink github={publicInfo.github} />}
          </Flex>
          <Flex gap={1} direction="column">
            {!isMobile && (
              <CtaSection
                id={codeId}
                name={localCodeInfo?.name}
                contractCount={undefined}
                cw2Contract={undefined}
                cw2Version={undefined}
                instantiatePermission={
                  code.instantiatePermission ?? AccessConfigPermission.UNKNOWN
                }
                permissionAddresses={code.permissionAddresses ?? []}
                uploader={localCodeInfo?.uploader ?? code.uploader}
              />
            )}
          </Flex>
        </Flex>
        {publicInfo && (
          <PublicDescription
            textLine={2}
            title="Public Code Description"
            description={publicInfo.description}
            icon={<CustomIcon ml={0} name="public-project" color="gray.600" />}
          />
        )}
      </>
    );
  }
);
