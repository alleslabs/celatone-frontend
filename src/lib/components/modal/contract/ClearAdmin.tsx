import { Text } from "@chakra-ui/react";
import { useCallback } from "react";

import { ActionModal } from "../ActionModal";
import { useClearAdminTx } from "lib/app-provider";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractAddr } from "lib/types";

interface ClearAdminModalProps {
  contractAddress: ContractAddr;
  triggerElement: JSX.Element;
}

export const ClearAdminModal = ({
  contractAddress,
  triggerElement,
}: ClearAdminModalProps) => {
  const { broadcast } = useTxBroadcast();
  const clearAdminTx = useClearAdminTx(contractAddress);

  const proceed = useCallback(async () => {
    AmpTrack(AmpEvent.ACTION_ADMIN_CLEAR);
    const stream = await clearAdminTx({});
    if (stream) broadcast(stream);
  }, [broadcast, clearAdminTx]);

  return (
    <ActionModal
      title="You'll no longer have admin access"
      icon="delete"
      iconColor="error.light"
      trigger={triggerElement}
      mainBtnTitle="Yes, clear it"
      mainAction={proceed}
      mainVariant="error"
      otherBtnTitle="No, keep it"
      otherVariant="ghost-secondary"
    >
      <Text>
        Clearing the admin is a permanent action. You&apos;ll not be able to
        reassign an admin and migrations will no longer be possible.
      </Text>
    </ActionModal>
  );
};
