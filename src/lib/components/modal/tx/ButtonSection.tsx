import { Button, Icon } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { FiChevronRight } from "react-icons/fi";

import { getExplorerTxUrl } from "lib/app-fns/explorer";
import { useInternalNavigate } from "lib/app-provider";
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
      `${getExplorerTxUrl(currentChainName)}/${txHash}`,
      "_blank",
      "noopener,noreferrer"
    );
    onClose?.();
  }, [receipts, onClose, currentChainName]);

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
            Go to Code List
          </Button>
          <Button
            variant="primary"
            rightIcon={
              <Icon as={FiChevronRight} color="gray.900" fontSize="18px" />
            }
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
          </Button>
        </>
      );
    case "upload-migrate":
      return (
        <Button
          variant="primary"
          rightIcon={
            <Icon as={FiChevronRight} color="gray.900" fontSize="18px" />
          }
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
        </Button>
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
