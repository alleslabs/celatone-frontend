import type { Code } from "lib/services/types";
import type {
  Nullable,
  Nullish,
  ProjectInfo,
  PublicCodeInfo,
  WasmVerifyInfo,
} from "lib/types";

import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useMobile, useTierConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { GitHubLink } from "lib/components/links";
import { PublicDescription } from "lib/components/PublicDescription";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { useCodeStore } from "lib/providers/store";
import { AccessConfigPermission } from "lib/types";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";
import { observer } from "mobx-react-lite";

import { CtaSection } from "../CtaSection";

interface CodeTopInfoProps {
  codeId: number;
  code: Code;
  projectInfo: Nullable<ProjectInfo>;
  publicInfo: Nullable<PublicCodeInfo>;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CodeTopInfo = observer(
  ({
    codeId,
    code,
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
              text: projectInfo?.name ? "Public projects" : "Codes",
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
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          my={{ base: 3, md: 6 }}
        >
          <Flex direction="column" gap={{ base: 2, md: 1 }}>
            <Flex
              align="center"
              justify={{ base: "space-between", md: "start" }}
            >
              <Flex align="center" gap={1} minH="36px">
                <CustomIcon boxSize={5} color="primary.main" name="code" />
                {projectInfo && (
                  <Image
                    alt={projectInfo.name}
                    borderRadius="full"
                    height={7}
                    src={projectInfo.logo}
                    width={7}
                  />
                )}
                <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
                  {localCodeInfo?.name ?? publicInfo?.name ?? codeId}
                </Heading>
                <WasmVerifyBadge
                  relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                  status={getWasmVerifyStatus(wasmVerifyInfo)}
                />
              </Flex>
            </Flex>
            {publicInfo && (
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 0, md: 2 }}
                mt={{ base: 2, md: 0 }}
              >
                <Text fontWeight={500} color="text.dark" variant="body2">
                  Public code name:
                </Text>
                <Text variant="body2">{publicInfo.name}</Text>
              </Flex>
            )}
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 0, md: 2 }}
            >
              <Text color="text.dark" fontWeight={500} variant="body2">
                Code ID:
              </Text>
              <CopyLink
                amptrackSection="code_top"
                type="code_id"
                value={codeId.toString()}
              />
            </Flex>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 0, md: 2 }}
            >
              <Text fontWeight={500} color="text.dark" variant="body2">
                Code hash:
              </Text>
              <CopyLink
                amptrackSection="code_hash"
                type="code_hash"
                value={code.hash.toUpperCase()}
              />
            </Flex>
            {isFullTier && (
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 0, md: 2 }}
              >
                <Text fontWeight={500} color="text.dark" variant="body2">
                  CW2 info:
                </Text>
                <Text
                  color={cw2Info ? "text.main" : "text.disabled"}
                  variant="body2"
                  wordBreak="break-all"
                >
                  {cw2Info ?? "N/A"}
                </Text>
              </Flex>
            )}
            {publicInfo && <GitHubLink github={publicInfo.github} />}
          </Flex>
          <Flex direction="column" gap={1}>
            {!isMobile && (
              <CtaSection
                id={codeId}
                contractCount={undefined}
                cw2Contract={undefined}
                cw2Version={undefined}
                instantiatePermission={
                  code.instantiatePermission ?? AccessConfigPermission.UNKNOWN
                }
                name={localCodeInfo?.name}
                permissionAddresses={code.permissionAddresses ?? []}
                uploader={localCodeInfo?.uploader ?? code.uploader}
              />
            )}
          </Flex>
        </Flex>
        {publicInfo && (
          <PublicDescription
            title="Public code description"
            description={publicInfo.description}
            icon={<CustomIcon color="gray.600" ml={0} name="public-project" />}
            textLine={2}
            title="Public Code Description"
          />
        )}
      </>
    );
  }
);
