import type { BechAddr32 } from "lib/types";

import { Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { WasmVerifySubmitModal } from "lib/components/modal";
import { WasmVerifyStatus } from "lib/types";

import { ExplorerLink } from "../ExplorerLink";
import { VerifyButton } from "./VerifyButton";

interface NotVerifiedDetailsProps {
  codeId: number;
  codeHash: string;
  contractAddress?: BechAddr32;
}

export const NotVerifiedDetails = ({
  codeHash,
  codeId,
  contractAddress,
}: NotVerifiedDetailsProps) => {
  const isMobile = useMobile();
  return (
    <>
      <Text color="text.dark" variant="body2">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <ExplorerLink
              showCopyOnHover
              type="code_id"
              value={codeId.toString()}
            />{" "}
            which has not been verified.
          </>
        ) : (
          <>This code has not been verified.</>
        )}{" "}
        If you are the owner of the code, you can{" "}
        {isMobile ? (
          <>verify it</>
        ) : (
          <WasmVerifySubmitModal
            codeHash={codeHash}
            codeId={codeId}
            contractAddress={contractAddress}
            triggerElement={
              <Text
                _hover={{
                  textDecoration: "underline",
                  textDecorationColor: "primary.light",
                }}
                as="span"
                color="primary.main"
                cursor="pointer"
                transition="all 0.25s ease-in-out"
              >
                verify it
              </Text>
            }
            wasmVerifyStatus={WasmVerifyStatus.NOT_VERIFIED}
          />
        )}{" "}
        to allow other users to view the GitHub repository and use the
        query/execute functions through the generated schema.
      </Text>
      {isMobile ? (
        <Text color="text.dark" variant="body2">
          Verification process is only currently supported on desktop.
        </Text>
      ) : (
        <VerifyButton
          codeHash={codeHash}
          codeId={codeId}
          wasmVerifyStatus={WasmVerifyStatus.NOT_VERIFIED}
        />
      )}
    </>
  );
};
