import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiChevronRight } from "react-icons/fi";

import type { ActionVariant, TxReceipt } from "lib/types";

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
  // TODO: Figure out how to get tx hash on failed case and others

  // const { currentChainName } = useWallet();

  // const openExplorer = useCallback(() => {
  //   const txHash = receipts.find((r) => r.title === "Tx Hash")?.value;
  //   window.open(
  //     `${getExplorerTxUrl(currentChainName)}/${txHash}`,
  //     "_blank",
  //     "noopener,noreferrer"
  //   );
  //   onClose?.();
  // }, [receipts, onClose, currentChainName]);

  switch (actionVariant) {
    case "sending":
      return null;
    case "upload":
      return (
        <>
          <Button
            variant="ghost-primary"
            onClick={() => {
              router.push("/codes");
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
              router.push({
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
    case "resend":
      return (
        <Button variant="outline-primary" onClick={onClose}>
          Close
        </Button>
      );
    case "rejected":
    default:
      return (
        <>
          <Button variant="outline-primary" onClick={onClose} w="120px">
            Close
          </Button>
          {/* <Button variant="primary" onClick={openExplorer}>
            See Transaction
          </Button> */}
        </>
      );
  }
};
