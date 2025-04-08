import type { AccountLocalInfo } from "lib/stores/account";

import { useCelatoneApp } from "lib/app-provider";
import { useHandleAccountSave } from "lib/hooks";

import { EditableCell } from "../EditableCell";

interface AccountNameCellProps {
  accountLocalInfo: AccountLocalInfo;
}
export const AccountNameCell = ({ accountLocalInfo }: AccountNameCellProps) => {
  const { constants } = useCelatoneApp();
  const onSave = useHandleAccountSave({
    title: "Changed name successfully!",
    address: accountLocalInfo.address,
    name: accountLocalInfo.name ?? "",
    description: accountLocalInfo.description,
    actions: () => {},
  });
  return (
    <EditableCell
      initialValue={accountLocalInfo.name}
      defaultValue="Untitled name"
      maxLength={constants.maxAccountNameLength}
      onSave={onSave}
    />
  );
};
