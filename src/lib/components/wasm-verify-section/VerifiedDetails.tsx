import type { TextProps } from "@chakra-ui/react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { isNull } from "lodash";
import Link from "next/link";

import { Copier } from "lib/components/copy";
import { WasmVerifyStatusModal } from "lib/components/modal";
import { StatusMessageBox } from "lib/components/StatusMessageBox";
import { WasmVerifyStatus } from "lib/types";
import type {
  BechAddr32,
  JsonDataType,
  Nullish,
  WasmVerifyInfoBase,
} from "lib/types";
import { formatUTC } from "lib/utils";
import { ExplorerLink } from "../ExplorerLink";
import { WasmVerifyBadge } from "../WasmVerifyBadge";

const baseTextStyle: TextProps = {
  color: "text.dark",
  variant: "body2",
};

interface VerifyDetailsProps {
  codeHash: string;
  verificationInfo: WasmVerifyInfoBase;
  schema: Nullish<JsonDataType>;
  relatedVerifiedCodes: number[];
  contractAddress?: BechAddr32;
}

export const VerifiedDetails = ({
  codeHash,
  verificationInfo,
  schema,
  relatedVerifiedCodes,
  contractAddress,
}: VerifyDetailsProps) => {
  const gitUrlWithCommit = `${verificationInfo.gitUrl}/tree/${verificationInfo.commit}`;
  return contractAddress ? (
    <>
      <Text variant="body2" color="text.dark">
        This contract is an instance of code ID{" "}
        <Flex as="span" display="inline-flex" align="center">
          <ExplorerLink
            type="code_id"
            value={verificationInfo.codeId.toString()}
            rightIcon={<WasmVerifyBadge status={WasmVerifyStatus.VERIFIED} />}
            showCopyOnHover
          />
        </Flex>{" "}
        which has been verified.
      </Text>
      <WasmVerifyStatusModal
        codeHash={codeHash}
        verificationInfo={verificationInfo}
        relatedVerifiedCodes={relatedVerifiedCodes}
        triggerElement={
          <Button variant="ghost-primary" size="sm">
            View Details
          </Button>
        }
      />
    </>
  ) : (
    <Flex direction="column" gap={6} w="full">
      <Flex direction="column" gap={1}>
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
          <Text color="primary.main" variant="body2" className="ellipsis">
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
      <Flex gap={{ base: 6, md: 12 }} direction={{ base: "column", md: "row" }}>
        <Flex direction="column" gap={1}>
          <Text {...baseTextStyle}>Compiler Version</Text>
          <Text color="text.main" variant="body2">
            {verificationInfo.compilerVersion}
          </Text>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text {...baseTextStyle}>Verified on</Text>
          <Text color="text.main" variant="body2">
            {verificationInfo.comparedTimestamp
              ? formatUTC(verificationInfo.comparedTimestamp)
              : "N/A"}
          </Text>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text {...baseTextStyle}>Verification details</Text>
          <WasmVerifyStatusModal
            codeHash={codeHash}
            verificationInfo={verificationInfo}
            relatedVerifiedCodes={relatedVerifiedCodes}
            triggerElement={
              <Flex
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
                <Text color="primary.main" variant="body2" fontWeight={600}>
                  View Details
                </Text>
              </Flex>
            }
          />
        </Flex>
      </Flex>
      {isNull(schema) && (
        <StatusMessageBox
          content={
            <Text
              {...baseTextStyle}
              color="text.main"
              overflow="hidden"
              overflowWrap="break-word"
            >
              The JSON schema cannot be found in the compiled codes. Its
              contract instances will not be available for querying or executing
              through the schema.
            </Text>
          }
        />
      )}
    </Flex>
  );
};
