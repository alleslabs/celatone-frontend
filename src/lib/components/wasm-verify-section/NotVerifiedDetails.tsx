import { Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { useMobile } from "lib/app-provider";
import { WasmVerifySubmitModal } from "lib/components/modal";
import { WasmVerifyStatus } from "lib/types";
import type { BechAddr32 } from "lib/types";

import { VerifyButton } from "./VerifyButton";

interface NotVerifiedDetailsProps {
  codeId: number;
  codeHash: string;
  contractAddress?: BechAddr32;
}

export const NotVerifiedDetails = ({
  codeId,
  codeHash,
  contractAddress,
}: NotVerifiedDetailsProps) => {
  const isMobile = useMobile();
  return isMobile ? (
    <Text variant="body2" color="text.dark">
      {contractAddress ? (
        <>
          This contract is an instance of code ID{" "}
          <ExplorerLink
            value={codeId.toString()}
            type="code_id"
            showCopyOnHover
          />{" "}
          which has not been verified. If you are the owner, you can verify it
          on the desktop interface to allow others to access the GitHub
          repository and use the query/execute functions.
        </>
      ) : (
        <>
          This code has not been verified. If you are the owner, you can verify
          it to allow others to access the GitHub repository and use the
          query/execute functions.
          <br />
          <br />
          Verification process is only currently supported on desktop.{" "}
        </>
      )}
    </Text>
  ) : (
    <>
      <Text variant="body2" color="text.dark">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <Text as="span" color="secondary.main" display="inline-flex">
              {codeId}
            </Text>{" "}
            which has not been verified.
          </>
        ) : (
          <>This code has not been verified.</>
        )}{" "}
        If you are the owner of the code, you can{" "}
        <WasmVerifySubmitModal
          codeId={codeId}
          codeHash={codeHash}
          wasmVerifyStatus={WasmVerifyStatus.NOT_VERIFIED}
          contractAddress={contractAddress}
          triggerElement={
            <Text
              as="span"
              cursor="pointer"
              color="primary.main"
              transition="all 0.25s ease-in-out"
              _hover={{
                textDecoration: "underline",
                textDecorationColor: "primary.light",
              }}
            >
              verify it
            </Text>
          }
        />{" "}
        to allow other users to view the GitHub repository and use the
        query/execute functions through the generated schema.
      </Text>
      <VerifyButton
        codeId={codeId}
        codeHash={codeHash}
        wasmVerifyStatus={WasmVerifyStatus.NOT_VERIFIED}
      />
    </>
  );
};
