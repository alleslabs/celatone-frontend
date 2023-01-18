import { Code, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { MdDeleteForever } from "react-icons/md";

import { ActionModal } from "../ActionModal";
import { useClearAdminTx } from "lib/app-provider/tx/clearAdmin";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { ContractAddr } from "lib/types";

interface ClearAdminContractProps {
  contractAddress: ContractAddr;
  triggerElement: JSX.Element;
}

export const ClearAdminContract = ({
  contractAddress,
  triggerElement,
}: ClearAdminContractProps) => {
  const { broadcast } = useTxBroadcast();
  const clearAdminTx = useClearAdminTx(contractAddress);

  const proceed = useCallback(async () => {
    const stream = await clearAdminTx({ onTxSucceed: () => {} });
    if (stream) broadcast(stream);
  }, [broadcast, clearAdminTx]);

  return (
    <ActionModal
      title="You'll no longer have admin access"
      icon={MdDeleteForever}
      iconColor="error.light"
      trigger={triggerElement}
      mainBtnTitle="Yes, clear it"
      mainAction={proceed}
      mainVariant="error"
      otherBtnTitle="No, keep it"
      otherVariant="ghost-primary"
    >
      <Text>
        &lsquo;Clear Admin&rsquo; will set the admin of the contract to{" "}
        <Code>nil</Code> , while will disable further migrations/updates on this
        contract.
      </Text>
    </ActionModal>
  );
};
