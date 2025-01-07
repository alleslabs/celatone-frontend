import { Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { useMobile } from "lib/app-provider";
import { WasmVerifySubmitModal } from "lib/components/modal";
import type { BechAddr32 } from "lib/types";
import { WasmVerifyStatus } from "lib/types";

import { VerifyButton } from "./VerifyButton";

interface NotVerifiedDetailsProps {
  codeHash: string;
  codeId: number;
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
      <Text variant="body2" color="text.dark">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <ExplorerLink
              type="code_id"
              value={codeId.toString()}
              showCopyOnHover
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
            triggerElement={
              <Text
                as="span"
                _hover={{
                  textDecoration: "underline",
                  textDecorationColor: "primary.light",
                }}
                color="primary.main"
                cursor="pointer"
                transition="all 0.25s ease-in-out"
              >
                verify it
              </Text>
            }
            wasmVerifyStatus={WasmVerifyStatus.NOT_VERIFIED}
            codeHash={codeHash}
            codeId={codeId}
            contractAddress={contractAddress}
          />
        )}{" "}
        to allow other users to view the GitHub repository and use the
        query/execute functions through the generated schema.
      </Text>
      {isMobile ? (
        <Text variant="body2" color="text.dark">
          Verification process is only currently supported on desktop.
        </Text>
      ) : (
        <VerifyButton
          wasmVerifyStatus={WasmVerifyStatus.NOT_VERIFIED}
          codeHash={codeHash}
          codeId={codeId}
        />
      )}
    </>
  );
};
