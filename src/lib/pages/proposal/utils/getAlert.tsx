import { CustomIcon } from "lib/components/icon";
import { big } from "lib/types";
import type { Nullable, Option } from "lib/types";
import { d2Formatter } from "lib/utils";

interface AlertProps {
  description: string;
  icon: Nullable<JSX.Element>;
  variant: string;
}
const defaultAlertProps: AlertProps = {
  description: "",
  icon: null,
  variant: "",
};

export const getAlert = (
  amount: string,
  minDepositAmount: Option<string>,
  minVotingDepositAmount: Option<string>,
  denom: Option<string>
): AlertProps => {
  const enteredAmount = big(amount || 0);
  if (!minVotingDepositAmount || !minDepositAmount) return defaultAlertProps;

  if (enteredAmount.lt(minDepositAmount)) {
    return {
      description: `${minDepositAmount} ${denom} is required to enter the deposit period.`,
      icon: (
        <CustomIcon
          name="alert-triangle-solid"
          boxSize={4}
          color="error.main"
        />
      ),
      variant: "error",
    };
  }
  if (enteredAmount.lt(minVotingDepositAmount)) {
    return {
      description: `${d2Formatter(
        big(minVotingDepositAmount).sub(enteredAmount),
        "NaN"
      )} more ${denom} is required to enter the voting period. If you proceed with this amount without further deposit after 7 days, The chain will remove your proposal with no fund return.`,
      icon: (
        <CustomIcon
          name="alert-triangle-solid"
          boxSize={4}
          color="warning.main"
        />
      ),
      variant: "warning",
    };
  }
  if (enteredAmount.eq(minVotingDepositAmount)) {
    return {
      description:
        "The proposal will proceed to voting period immediately after created.",
      icon: <CustomIcon name="info-circle" boxSize={4} color="primary.main" />,
      variant: "primary",
    };
  }
  if (big(minVotingDepositAmount).lt(enteredAmount)) {
    return {
      description: `You’re depositing more than the minimum requirement, the proposal will proceed to voting immediately after creation. To prevent fund loss if not passing the quorum, deposit equal to the minimum requirement.
`,
      icon: (
        <CustomIcon
          name="alert-triangle-solid"
          boxSize={4}
          color="warning.main"
        />
      ),
      variant: "warning",
    };
  }
  return defaultAlertProps;
};
