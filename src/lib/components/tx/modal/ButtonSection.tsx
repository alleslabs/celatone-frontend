import type { ActionVariant, TxReceipt } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { getNavigationUrl } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useOpenTxTab } from "lib/hooks";
import { openNewTab } from "lib/utils";
import { useRouter } from "next/router";

// TODO: refactor props to pass param in txResultRendering instead of receipt
interface ButtonSectionProps {
  actionVariant?: ActionVariant;
  onClose?: () => void;
  receipts: TxReceipt[];
  errorMsg?: string;
}

export const ButtonSection = ({
  actionVariant,
  onClose,
  receipts,
  errorMsg = "",
}: ButtonSectionProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const openTxTab = useOpenTxTab("tx-page");

  const openTxExplorer = () => {
    const txHash = receipts
      .find((r) => r.title === "Tx Hash")
      ?.value?.toString();
    openTxTab(txHash);
  };

  const openProposalExplorer = () => {
    const proposalId = receipts
      .find((r) => r.title === "Proposal ID")
      ?.value?.toString();
    // TOOD: revisit retrieving url (make a proper hook)
    openNewTab(
      getNavigationUrl({
        type: "proposal_id",
        value: proposalId ?? "",
      })
    );
    onClose?.();
  };

  switch (actionVariant) {
    case "sending":
      return null;
    case "upload-migrate":
      return (
        <Button
          variant="primary"
          onClick={() => {
            const codeId = receipts.find((r) => r.title === "Code ID")?.value;
            navigate({
              pathname: "/migrate",
              query: { contract: router.query.contract, codeId },
            });
            onClose?.();
          }}
        >
          Proceed to Migrate
          <CustomIcon boxSize={3} name="migrate" />
        </Button>
      );
    case "migrate":
    case "update-admin":
      return (
        <>
          <Button variant="ghost-primary" onClick={openTxExplorer}>
            See Transaction
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              navigate({ pathname: `/contracts/${router.query.contract}` })
            }
          >
            View Contract Details
            <CustomIcon boxSize={3} name="chevron-right" />
          </Button>
        </>
      );
    case "rejected":
    case "resend":
      return (
        <Button variant="outline-primary" w="120px" onClick={onClose}>
          Close
        </Button>
      );
    case "proposal":
      return (
        <>
          <Button
            variant="ghost-primary"
            // TODO: Revisit this when proposal page is live
            onClick={openProposalExplorer}
          >
            View Proposal
            <CustomIcon boxSize={3} ml={2} name="launch" />
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
            <CustomIcon boxSize={3} ml={2} name="chevron-right" />
          </Button>
        </>
      );
    case "failed":
      return (
        <Flex justify="space-between" w="full">
          <CopyButton
            amptrackSection="tx_error_log"
            buttonText="Copy Error Log"
            size="md"
            value={errorMsg}
          />
          <Flex gap={2}>
            <Button variant="outline-primary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={openTxExplorer}>
              See Transaction
            </Button>
          </Flex>
        </Flex>
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
