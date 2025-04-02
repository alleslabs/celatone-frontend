import type { TextProps } from "@chakra-ui/react";
import type {
  BechAddr32,
  JsonDataType,
  Nullish,
  WasmVerifyInfoBase,
} from "lib/types";

import { Button, Flex, Text } from "@chakra-ui/react";
import { Copier } from "lib/components/copy";
import { WasmVerifyStatusModal } from "lib/components/modal";
import { StatusMessageBox } from "lib/components/StatusMessageBox";
import { WasmVerifyStatus } from "lib/types";
import { formatUTC } from "lib/utils";
import { isNull } from "lodash";
import Link from "next/link";

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
      <Text color="text.dark" variant="body2">
        This contract is an instance of code ID{" "}
        <Flex align="center" as="span" display="inline-flex">
          <ExplorerLink
            rightIcon={<WasmVerifyBadge status={WasmVerifyStatus.VERIFIED} />}
            showCopyOnHover
            type="code_id"
            value={verificationInfo.codeId.toString()}
          />
        </Flex>{" "}
        which has been verified.
      </Text>
      <WasmVerifyStatusModal
        codeHash={codeHash}
        relatedVerifiedCodes={relatedVerifiedCodes}
        triggerElement={
          <Button size="sm" variant="ghost-primary">
            View Details
          </Button>
        }
        verificationInfo={verificationInfo}
      />
    </>
  ) : (
    <Flex direction="column" gap={6} w="full">
      <Flex direction="column" gap={1}>
        <Text {...baseTextStyle}>Source Code:</Text>
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
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 6, md: 12 }}>
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
            relatedVerifiedCodes={relatedVerifiedCodes}
            triggerElement={
              <Flex
                alignItems="center"
                gap={1}
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
                <Text color="primary.main" fontWeight={600} variant="body2">
                  View Details
                </Text>
              </Flex>
            }
            verificationInfo={verificationInfo}
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
