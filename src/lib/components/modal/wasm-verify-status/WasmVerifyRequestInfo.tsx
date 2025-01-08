import type { FlexProps, TextProps } from "@chakra-ui/react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { Copier } from "../../copy";
import { CopyLink } from "../../CopyLink";
import { ExplorerLink } from "../../ExplorerLink";
import { WasmVerifyBadge } from "../../WasmVerifyBadge";
import type { WasmVerifyInfoBase } from "lib/types";
import { formatUTC, getWasmVerifyStatus } from "lib/utils";

const baseTextStyle: TextProps = {
  color: "text.dark",
  variant: "body2",
  whiteSpace: "nowrap",
};

const baseContainerStyle: FlexProps = {
  alignItems: { bases: "start", sm: "center" },
  direction: { base: "column", sm: "row" },
  gap: { base: 0, sm: 2 },
};

interface WasmVerifyRequestInfoProps {
  codeHash: string;
  relatedVerifiedCodes: number[];
  verificationInfo: WasmVerifyInfoBase;
}

export const WasmVerifyRequestInfo = ({
  codeHash,
  relatedVerifiedCodes,
  verificationInfo,
}: WasmVerifyRequestInfoProps) => {
  const wasmVerifyStatus = getWasmVerifyStatus({
    relatedVerifiedCodes,
    schema: null,
    verificationInfo,
  });

  const gitUrlWithCommit = `${verificationInfo.gitUrl}/tree/${verificationInfo.commit}`;
  return (
    <>
      <Flex gap={{ base: 2, sm: 6 }} direction={{ base: "column", sm: "row" }}>
        <Flex alignItems="center" gap={2}>
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
        <Flex alignItems="center" gap={2}>
          <Text {...baseTextStyle}>Code Hash:</Text>
          <CopyLink
            isTruncate
            type="code_hash"
            value={codeHash.toUpperCase()}
            amptrackSection="code_hash"
            showCopyOnHover
          />
        </Flex>
      </Flex>
      <Divider borderColor="gray.700" />{" "}
      <Flex gap={{ base: 2, sm: 1 }} direction="column">
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Source Code:</Text>
          <Flex
            alignItems="center"
            gap={1}
            sx={{
              "&:hover": {
                "> *": {
                  color: "primary.light",
                  textDecoration: "underline",
                  transition: "all",
                  transitionDuration: "0.25s",
                  transitionTimingFunction: "ease-in-out",
                },
              },
              cursor: "pointer",
            }}
            overflow="hidden"
          >
            <Text className="ellipsis" variant="body2" color="primary.main">
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href={gitUrlWithCommit}
              >
                {gitUrlWithCommit}
              </Link>
            </Text>
            <Copier ml={1} type="source_code" value={gitUrlWithCommit} />
          </Flex>
        </Flex>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Package Name:</Text>
          <Text variant="body2" color="text.main">
            {verificationInfo.packageName}
          </Text>
        </Flex>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Compiler Version:</Text>
          <Text variant="body2" color="text.main">
            {verificationInfo.compilerVersion}
          </Text>
        </Flex>
        <Flex {...baseContainerStyle}>
          <Text {...baseTextStyle}>Submitted on:</Text>
          <Text variant="body2" color="text.main">
            {formatUTC(verificationInfo.submittedTimestamp)}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
