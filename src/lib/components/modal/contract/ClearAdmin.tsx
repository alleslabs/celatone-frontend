import { Text } from "@chakra-ui/react";
import { useCallback } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useClearAdminTx } from "lib/app-provider";
import { useTxBroadcast } from "lib/hooks";
import type { BechAddr32 } from "lib/types";
import { ActionModal } from "../ActionModal";

interface ClearAdminModalProps {
  contractAddress: BechAddr32;
  triggerElement: JSX.Element;
}

export const ClearAdminModal = ({
  contractAddress,
  triggerElement,
}: ClearAdminModalProps) => {
  const { broadcast } = useTxBroadcast();
  const clearAdminTx = useClearAdminTx(contractAddress);

  const proceed = useCallback(async () => {
    track(AmpEvent.ACTION_ADMIN_CLEAR);
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
      otherVariant="outline-primary"
    >
      <Text>
        Clearing the admin is a permanent action. You&apos;ll not be able to
        reassign an admin and migrations will no longer be possible.
      </Text>
    </ActionModal>
  );
};
