import type { TextProps } from "@chakra-ui/react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { isNull } from "lodash";
import Link from "next/link";

import { ExplorerLink } from "../ExplorerLink";
import { WasmVerifyBadge } from "../WasmVerifyBadge";
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

const baseTextStyle: TextProps = {
  color: "text.dark",
  variant: "body2",
};

interface VerifyDetailsProps {
  codeHash: string;
  contractAddress?: BechAddr32;
  relatedVerifiedCodes: number[];
  schema: Nullish<JsonDataType>;
  verificationInfo: WasmVerifyInfoBase;
}

export const VerifiedDetails = ({
  codeHash,
  contractAddress,
  relatedVerifiedCodes,
  schema,
  verificationInfo,
}: VerifyDetailsProps) => {
  const gitUrlWithCommit = `${verificationInfo.gitUrl}/tree/${verificationInfo.commit}`;
  return contractAddress ? (
    <>
      <Text variant="body2" color="text.dark">
        This contract is an instance of code ID{" "}
        <Flex align="center" as="span" display="inline-flex">
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
        triggerElement={
          <Button size="sm" variant="ghost-primary">
            View Details
          </Button>
        }
        codeHash={codeHash}
        relatedVerifiedCodes={relatedVerifiedCodes}
        verificationInfo={verificationInfo}
      />
    </>
  ) : (
    <Flex gap={6} w="full" direction="column">
      <Flex gap={1} direction="column">
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
      <Flex gap={{ base: 6, md: 12 }} direction={{ base: "column", md: "row" }}>
        <Flex gap={1} direction="column">
          <Text {...baseTextStyle}>Compiler Version</Text>
          <Text variant="body2" color="text.main">
            {verificationInfo.compilerVersion}
          </Text>
        </Flex>
        <Flex gap={1} direction="column">
          <Text {...baseTextStyle}>Verified on</Text>
          <Text variant="body2" color="text.main">
            {verificationInfo.comparedTimestamp
              ? formatUTC(verificationInfo.comparedTimestamp)
              : "N/A"}
          </Text>
        </Flex>
        <Flex gap={1} direction="column">
          <Text {...baseTextStyle}>Verification details</Text>
          <WasmVerifyStatusModal
            triggerElement={
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
              >
                <Text variant="body2" color="primary.main" fontWeight={600}>
                  View Details
                </Text>
              </Flex>
            }
            codeHash={codeHash}
            relatedVerifiedCodes={relatedVerifiedCodes}
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
