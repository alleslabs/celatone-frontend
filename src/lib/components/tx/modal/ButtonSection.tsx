import { Button } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";

import { getExplorerProposalUrl } from "lib/app-fns/explorer";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { openNewTab, useOpenTxTab } from "lib/hooks";
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
  const openTxTab = useOpenTxTab("tx-page");
  const { currentChainName } = useWallet();

  const openTxExplorer = () => {
    const txHash = receipts
      .find((r) => r.title === "Tx Hash")
      ?.value?.toString();
    openTxTab(txHash);
    onClose?.();
  };

  const openProposalExplorer = () => {
    const proposalId = receipts
      .find((r) => r.title === "Proposal ID")
      ?.value?.toString();
    openNewTab(`${getExplorerProposalUrl(currentChainName)}/${proposalId}`);
    onClose?.();
  };

  switch (actionVariant) {
    case "sending":
      return null;
    case "upload":
      return (
        <>
          <Button
            variant="ghost-secondary"
            onClick={() => {
              navigate({ pathname: "/my-codes" });
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
            <CustomIcon name="instantiate" boxSize="3" />
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
          <CustomIcon name="migrate" boxSize="3" />
        </Button>
      );
    case "migrate":
    case "update-admin":
      return (
        <>
          <Button variant="ghost-secondary" onClick={openTxExplorer}>
            See Transaction
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              navigate({ pathname: `/contracts/${router.query.contract}` })
            }
          >
            View Contract Details
            <CustomIcon name="chevron-right" boxSize="3" />
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
    case "proposal":
      return (
        <>
          <Button
            variant="ghost-secondary"
            // TODO: Revisit this when proposal page is live
            onClick={openProposalExplorer}
          >
            View Proposal
            <CustomIcon name="launch" boxSize={3} ml={2} />
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              navigate({
                pathname: "/proposals",
              });
              onClose?.();
            }}
          >
            See in Proposal List
            <CustomIcon name="chevron-right" boxSize={3} ml={2} />
          </Button>
        </>
      );
    default:
      return (
        <>
          <Button variant="outline-primary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={openTxExplorer}>
            See Transaction
          </Button>
        </>
      );
  }
};
