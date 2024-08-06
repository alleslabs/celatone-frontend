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
}: VerifyDetailsProps) =>
  contractAddress ? (
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
    <Flex direction="column" gap={6}>
      <Flex direction="column" gap={1}>
        <Text {...baseTextStyle}>Source Code:</Text>
        <Link
          href={verificationInfo.gitUrl}
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
              {verificationInfo.gitUrl}
            </Text>
            <Copier ml={1} type="source_code" value={verificationInfo.gitUrl} />
          </Flex>
        </Link>
      </Flex>
      <Flex gap={12}>
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
      {isNull(schema) && (
        <StatusMessageBox
          content={
            <Text {...baseTextStyle} color="text.main">
              The JSON schema cannot be found in the compiled codes. Its
              contract instances will not be available for querying or executing
              through the schema.
            </Text>
          }
        />
      )}
    </Flex>
  );
