import { EditableCell } from "../EditableCell";
import { useCelatoneApp } from "lib/app-provider";
import { useHandleAccountSave } from "lib/hooks";
import type { AccountLocalInfo } from "lib/stores/account";

interface SaveAccountsNameCellProps {
  account: AccountLocalInfo;
}
export const SaveAccountsNameCell = ({
  account,
}: SaveAccountsNameCellProps) => {
  const { constants } = useCelatoneApp();
  const onSave = useHandleAccountSave({
    title: "Changed name successfully!",
    address: account.address,
    name: account.name ?? "",
    description: account.description,
    actions: () => {},
  });
  return (
    <EditableCell
      initialValue={account.name}
      defaultValue="Untitled Name"
      maxLength={constants.maxAccountNameLength}
      onSave={onSave}
    />
  );
};
