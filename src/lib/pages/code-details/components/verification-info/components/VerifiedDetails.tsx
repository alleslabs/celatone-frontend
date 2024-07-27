import type { TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { Copier } from "lib/components/copy";
import { CodeVerificationStatus } from "lib/components/modal/code-verification-status";
import { StatusMessageBox } from "lib/components/StatusMessageBox";

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

export const VerifiedDetails = () => (
  <Flex direction="column" gap={6}>
    <Flex direction="column" gap={1}>
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
    <Flex gap={12}>
      <Flex direction="column" gap={1}>
        <Text {...baseTextStyle}>Compiler Version</Text>
        <Text color="text.main" variant="body2">
          {MOCKUP_DATA.verificationInfo.compilerVersion}
        </Text>
      </Flex>
      <Flex direction="column" gap={1}>
        <Text {...baseTextStyle}>Verified on</Text>
        <Text color="text.main" variant="body2">
          {MOCKUP_DATA.verificationInfo.compiledTimestamp}
        </Text>
      </Flex>
      <Flex direction="column" gap={1}>
        <Text {...baseTextStyle}>Verification details</Text>
        <CodeVerificationStatus
          triggerElement={
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
              <Text color="secondary.main" variant="body2" fontWeight={600}>
                View Details
              </Text>
            </Flex>
          }
        />
      </Flex>
    </Flex>
    {/* TODO: add condition for this element */}
    <StatusMessageBox
      content={
        <Text {...baseTextStyle} color="text.main">
          The JSON schema cannot be found in the compiled codes. Its contract
          instances will not be available for querying or executing through the
          schema.
        </Text>
      }
    />
  </Flex>
);
