import { EditableCell } from "../EditableCell";
import { useCelatoneApp } from "lib/app-provider";
import { useHandleAccountSave } from "lib/hooks";
import type { AccountLocalInfo } from "lib/stores/account";

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
      defaultValue="Untitled Name"
      initialValue={accountLocalInfo.name}
      maxLength={constants.maxAccountNameLength}
      onSave={onSave}
    />
  );
};
