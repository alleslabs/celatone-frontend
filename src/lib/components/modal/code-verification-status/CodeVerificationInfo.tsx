import type { TextProps } from "@chakra-ui/react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { Copier } from "lib/components/copy";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { formatUTC, parseDate } from "lib/utils";

const MOCKUP_DATA = {
  verificationInfo: {
    chainId: "osmo-test-5",
    codeId: 9453,
    gitUrl: "https://github.com/songwongtp/json-template",
    commit: "68a4114",
    fileName: "json-template",
    compilerVersion: "cosmwasm/rust-optimizer:0.15.0",
    submittedTimestamp: "2024-07-24T14:43:34.490Z",
    downloadedTimestamp: "2024-07-24T14:43:39.303Z",
    compiledTimestamp: "2024-07-24T14:44:41.547Z",
    comparedTimestamp: "2024-07-24T14:44:41.565Z",
    errorMessage: null,
  },
  schema: {},
  relatedVerifiedCodes: [9453],
};

const baseTextStyle: TextProps = {
  color: "text.dark",
  variant: "body2",
};

export const CodeVerificationInfo = () => {
  return (
    <>
      <Flex gap={6}>
        <Flex gap={2} alignItems="center" w={32} minW={32}>
          <Text {...baseTextStyle}>Code ID:</Text>
          <ExplorerLink
            type="code_id"
            value={MOCKUP_DATA.verificationInfo.codeId.toString()}
            openNewTab
            showCopyOnHover
          />
        </Flex>
        <Flex gap={2} alignItems="center">
          <Text {...baseTextStyle}>Code Hash:</Text>
          <ExplorerLink
            type="code_id"
            value={MOCKUP_DATA.verificationInfo.codeId.toString()}
            openNewTab
            showCopyOnHover
          />
        </Flex>
      </Flex>
      <Divider borderColor="gray.700" />
      <Flex direction="column" gap={1}>
        <Flex gap={2} alignItems="center">
          <Text {...baseTextStyle}>Source Code:</Text>
          <Link
            href={MOCKUP_DATA.verificationInfo.gitUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Flex
              gap={1}
              alignItems="center"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  "> *": {
                    color: "secondary.light",
                    textDecoration: "underline",
                    transition: "all",
                    transitionDuration: "0.25s",
                    transitionTimingFunction: "ease-in-out",
                  },
                },
              }}
            >
              <Text color="secondary.main" variant="body2">
                {MOCKUP_DATA.verificationInfo.gitUrl}
              </Text>
              <Copier
                ml={1}
                type="source_code"
                value={MOCKUP_DATA.verificationInfo.gitUrl}
              />
            </Flex>
          </Link>
        </Flex>
        <Flex gap={2} alignItems="center">
          <Text {...baseTextStyle}>Wasm File Name:</Text>
          <Text color="text.main" variant="body2">
            {MOCKUP_DATA.verificationInfo.fileName}
          </Text>
        </Flex>
        <Flex gap={2} alignItems="center">
          <Text {...baseTextStyle}>Compiler Version:</Text>
          <Text color="text.main" variant="body2">
            {MOCKUP_DATA.verificationInfo.compilerVersion}
          </Text>
        </Flex>
        <Flex gap={2} alignItems="center">
          <Text {...baseTextStyle}>Submitted on:</Text>
          <Text color="text.main" variant="body2">
            {formatUTC(
              parseDate(MOCKUP_DATA.verificationInfo.submittedTimestamp)
            )}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
