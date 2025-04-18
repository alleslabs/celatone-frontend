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
    actions: () => {},
    address: accountLocalInfo.address,
    description: accountLocalInfo.description,
    name: accountLocalInfo.name ?? "",
    title: "Changed name successfully!",
  });
  return (
    <EditableCell
      defaultValue="Untitled name"
      initialValue={accountLocalInfo.name}
      maxLength={constants.maxAccountNameLength}
      onSave={onSave}
    />
  );
};
