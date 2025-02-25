import type { FlexProps, TextProps } from "@chakra-ui/react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import type { WasmVerifyInfoBase } from "lib/types";
import { formatUTC, getWasmVerifyStatus } from "lib/utils";
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
        <Flex gap={2} alignItems="center">
          <Text {...baseTextStyle}>Code ID:</Text>
          <ExplorerLink
            type="code_id"
            value={verificationInfo.codeId.toString()}
            openNewTab
            showCopyOnHover
          />
          <WasmVerifyBadge
            status={wasmVerifyStatus}
            relatedVerifiedCodes={relatedVerifiedCodes}
          />
        </Flex>
        <Flex gap={2} alignItems="center">
          <Text {...baseTextStyle}>Code Hash:</Text>
          <CopyLink
            type="code_hash"
            amptrackSection="code_hash"
            value={codeHash.toUpperCase()}
            isTruncate
            showCopyOnHover
          />
        </Flex>
      </Flex>
      <Divider borderColor="gray.700" />{" "}
      <Flex direction="column" gap={{ base: 2, sm: 1 }}>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Source Code:</Text>
          <Flex
            overflow="hidden"
            gap={1}
            alignItems="center"
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
                target="_blank"
                rel="noopener noreferrer"
              >
                {gitUrlWithCommit}
              </Link>
            </Text>
            <Copier ml={1} type="source_code" value={gitUrlWithCommit} />
          </Flex>
        </Flex>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Package Name:</Text>
          <Text color="text.main" variant="body2">
            {verificationInfo.packageName}
          </Text>
        </Flex>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Compiler Version:</Text>
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
