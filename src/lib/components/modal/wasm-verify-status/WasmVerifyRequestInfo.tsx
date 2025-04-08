import type { FlexProps, TextProps } from "@chakra-ui/react";
import type { WasmVerifyInfoBase } from "lib/types";

import { Divider, Flex, Text } from "@chakra-ui/react";
import { formatUTC, getWasmVerifyStatus } from "lib/utils";
import Link from "next/link";

import { Copier } from "../../copy";
import { CopyLink } from "../../CopyLink";
import { ExplorerLink } from "../../ExplorerLink";
import { WasmVerifyBadge } from "../../WasmVerifyBadge";

const baseTextStyle: TextProps = {
  color: "text.dark",
  variant: "body2",
  whiteSpace: "nowrap",
};

const baseContainerStyle: FlexProps = {
  direction: { base: "column", sm: "row" },
  gap: { base: 0, sm: 2 },
  alignItems: { bases: "start", sm: "center" },
};

interface WasmVerifyRequestInfoProps {
  codeHash: string;
  verificationInfo: WasmVerifyInfoBase;
  relatedVerifiedCodes: number[];
}

export const WasmVerifyRequestInfo = ({
  codeHash,
  verificationInfo,
  relatedVerifiedCodes,
}: WasmVerifyRequestInfoProps) => {
  const wasmVerifyStatus = getWasmVerifyStatus({
    verificationInfo,
    schema: null,
    relatedVerifiedCodes,
  });

  const gitUrlWithCommit = `${verificationInfo.gitUrl}/tree/${verificationInfo.commit}`;
  return (
    <>
      <Flex direction={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 6 }}>
        <Flex alignItems="center" gap={2}>
          <Text {...baseTextStyle}>Code ID:</Text>
          <ExplorerLink
            openNewTab
            showCopyOnHover
            type="code_id"
            value={verificationInfo.codeId.toString()}
          />
          <WasmVerifyBadge
            relatedVerifiedCodes={relatedVerifiedCodes}
            status={wasmVerifyStatus}
          />
        </Flex>
        <Flex alignItems="center" gap={2}>
          <Text {...baseTextStyle}>Code hash:</Text>
          <CopyLink
            amptrackSection="code_hash"
            isTruncate
            showCopyOnHover
            type="code_hash"
            value={codeHash.toUpperCase()}
          />
        </Flex>
      </Flex>
      <Divider borderColor="gray.700" />{" "}
      <Flex direction="column" gap={{ base: 2, sm: 1 }}>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Source code:</Text>
          <Flex
            alignItems="center"
            gap={1}
            overflow="hidden"
            sx={{
              cursor: "pointer",
              "&:hover": {
                "> *": {
                  color: "primary.light",
                  textDecoration: "underline",
                  transition: "all",
                  transitionDuration: "0.25s",
                  transitionTimingFunction: "ease-in-out",
                },
              },
            }}
          >
            <Text className="ellipsis" color="primary.main" variant="body2">
              <Link
                href={gitUrlWithCommit}
                rel="noopener noreferrer"
                target="_blank"
              >
                {gitUrlWithCommit}
              </Link>
            </Text>
            <Copier ml={1} type="source_code" value={gitUrlWithCommit} />
          </Flex>
        </Flex>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Package name:</Text>
          <Text color="text.main" variant="body2">
            {verificationInfo.packageName}
          </Text>
        </Flex>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Compiler version:</Text>
          <Text color="text.main" variant="body2">
            {verificationInfo.compilerVersion}
          </Text>
        </Flex>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Submitted on:</Text>
          <Text color="text.main" variant="body2">
            {formatUTC(verificationInfo.submittedTimestamp)}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
