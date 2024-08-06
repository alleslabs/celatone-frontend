import { Flex, Text } from "@chakra-ui/react";
import { Fragment } from "react";

import { ExplorerLink } from "../ExplorerLink";
import { WasmVerifyBadge } from "../WasmVerifyBadge";
import { useMobile } from "lib/app-provider";
import type { BechAddr32 } from "lib/types";
import { WasmVerifyStatus } from "lib/types";

import { VerifyButton } from "./VerifyButton";

const RelatedVerifiedCodes = ({
  relatedVerifiedCodes,
}: {
  relatedVerifiedCodes: number[];
}) => {
  const displayedCodes = relatedVerifiedCodes.slice(0, 3);
  return (
    <>
      {displayedCodes.map((code, index) => (
        <Fragment key={code.toString()}>
          <ExplorerLink
            type="code_id"
            value={code.toString()}
            showCopyOnHover
          />
          {relatedVerifiedCodes.length > 2 &&
            index < displayedCodes.length - 1 &&
            ","}
          {index < displayedCodes.length - 1 && " "}
          {index === relatedVerifiedCodes.length - 2 && "and "}
        </Fragment>
      ))}
      {relatedVerifiedCodes.length > 3 && " and more"}
    </>
  );
};

interface IndirectlyVerifiedDetailsProps {
  codeId: number;
  codeHash: string;
  relatedVerifiedCodes: number[];
  contractAddress?: BechAddr32;
}

export const IndirectlyVerifiedDetails = ({
  codeId,
  codeHash,
  relatedVerifiedCodes,
  contractAddress,
}: IndirectlyVerifiedDetailsProps) => {
  const isMobile = useMobile();
  return isMobile ? (
    <Text variant="body2" color="text.dark">
      {contractAddress ? (
        <>
          This contract is an instance of code ID{" "}
          <Flex display="inline-flex" alignItems="center">
            <Text color="secondary.main" display="inline-flex" lineHeight={0}>
              {codeId}
            </Text>{" "}
            <WasmVerifyBadge
              status={WasmVerifyStatus.INDIRECTLY_VERIFIED}
              relatedVerifiedCodes={relatedVerifiedCodes}
            />
          </Flex>
          which has the same code hash with other verified codes. If you are the
          code owner, you can verify this code to specify the GitHub repository
        </>
      ) : (
        <>
          This code has the same code hash as the following verified stored
          codes: {RelatedVerifiedCodes({ relatedVerifiedCodes })}.
          <br /> <br /> If you are the code owner, you can verify this code to
          specify the GitHub repository on the desktop interface.
        </>
      )}
    </Text>
  ) : (
    <>
      <Text variant="body2" color="text.dark">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <Flex display="inline-flex" alignItems="center">
              <Text color="secondary.main" display="inline-flex" lineHeight={0}>
                {codeId}
              </Text>{" "}
              <WasmVerifyBadge
                status={WasmVerifyStatus.INDIRECTLY_VERIFIED}
                relatedVerifiedCodes={relatedVerifiedCodes}
              />
            </Flex>
            which has the same code hash with other verified codes. If you are
            the code owner, you can verify this code to specify the GitHub
            repository
          </>
        ) : (
          <>
            This code has the same code hash as the following verified stored
            codes: {RelatedVerifiedCodes({ relatedVerifiedCodes })}.
            <br /> If you are the code owner, you can verify this code to
            specify the GitHub repository.
          </>
        )}
      </Text>
      <VerifyButton
        codeId={codeId}
        codeHash={codeHash}
        wasmVerifyStatus={WasmVerifyStatus.INDIRECTLY_VERIFIED}
        relatedVerifiedCodes={relatedVerifiedCodes}
        contractAddress={contractAddress}
      />
    </>
  );
};
