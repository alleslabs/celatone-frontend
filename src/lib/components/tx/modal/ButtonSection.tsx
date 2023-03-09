import { Button } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { getNetworkByChainName } from "lib/data";
import type { ActionVariant, TxReceipt } from "lib/types";

// TODO: refactor props to pass param in txResultRendering instead of receipt
interface ButtonSectionProps {
  actionVariant?: ActionVariant;
  onClose?: () => void;
  receipts: TxReceipt[];
}

export const ButtonSection = ({
  actionVariant,
  onClose,
  receipts,
}: ButtonSectionProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { currentChainName } = useWallet();

  const openExplorer = useCallback(() => {
    const txHash = receipts.find((r) => r.title === "Tx Hash")?.value;
    window.open(
      `/${getNetworkByChainName(currentChainName)}/tx/${txHash}`,
      "_blank",
      "noopener,noreferrer"
    );
    onClose?.();
  }, [receipts, currentChainName, onClose]);

  switch (actionVariant) {
    case "sending":
      return null;
    case "upload":
      return (
        <>
          <Button
            variant="ghost-primary"
            onClick={() => {
              navigate({ pathname: "/codes" });
              onClose?.();
            }}
          >
            See my codes list
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const codeId = receipts.find((r) => r.title === "Code ID")?.value;
              navigate({
                pathname: "/instantiate",
                query: { "code-id": codeId },
              });
              onClose?.();
            }}
          >
            Proceed to instantiate
            <CustomIcon name="instantiate" color="text.main" boxSize="3" />
          </Button>
        </>
      );
    case "upload-migrate":
      return (
        <Button
          variant="primary"
          onClick={() => {
            const codeId = receipts.find((r) => r.title === "Code ID")?.value;

            navigate({
              pathname: "/migrate",
              query: { contract: router.query.contract, "code-id": codeId },
            });
            onClose?.();
          }}
        >
          Proceed to Migrate
          <CustomIcon name="migrate" color="text.main" boxSize="3" />
        </Button>
      );
    case "migrate":
    case "update-admin":
      return (
        <>
          <Button variant="ghost-primary" onClick={openExplorer}>
            See Transaction
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              navigate({ pathname: `/contract/${router.query.contract}` })
            }
          >
            View Contract Details
            <CustomIcon name="chevron-right" color="text.main" boxSize="3" />
          </Button>
        </>
      );
    case "rejected":
    case "resend":
      return (
        <Button variant="outline-primary" onClick={onClose} w="120px">
          Close
        </Button>
      );
    default:
      return (
        <>
          <Button variant="outline-primary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={openExplorer}>
            See Transaction
          </Button>
        </>
      );
  }
};
