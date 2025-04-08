import type { Nullable, Option } from "lib/types";

import { CustomIcon } from "lib/components/icon";
import { big } from "lib/types";
import { d2Formatter } from "lib/utils";

interface AlertProps {
  variant: string;
  description: string;
  icon: Nullable<JSX.Element>;
}
const defaultAlertProps: AlertProps = {
  variant: "",
  description: "",
  icon: null,
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
      variant: "error",
      description: `${minDepositAmount} ${denom} is required to enter the deposit period.`,
      icon: (
        <CustomIcon
          boxSize={4}
          color="error.main"
          name="alert-triangle-solid"
        />
      ),
    };
  }
  if (enteredAmount.lt(minVotingDepositAmount)) {
    return {
      variant: "warning",
      description: `${d2Formatter(
        big(minVotingDepositAmount).sub(enteredAmount),
        "NaN"
      )} more ${denom} is required to enter the voting period. If you proceed with this amount without further deposit after 7 days, The chain will remove your proposal with no fund return.`,
      icon: (
        <CustomIcon
          boxSize={4}
          color="warning.main"
          name="alert-triangle-solid"
        />
      ),
    };
  }
  if (enteredAmount.eq(minVotingDepositAmount)) {
    return {
      variant: "primary",
      description:
        "The proposal will proceed to voting period immediately after created.",
      icon: <CustomIcon boxSize={4} color="primary.main" name="info-circle" />,
    };
  }
  if (big(minVotingDepositAmount).lt(enteredAmount)) {
    return {
      variant: "warning",
      description: `You’re depositing more than the minimum requirement, the proposal will proceed to voting immediately after creation. To prevent fund loss if not passing the quorum, deposit equal to the minimum requirement.
`,
      icon: (
        <CustomIcon
          boxSize={4}
          color="warning.main"
          name="alert-triangle-solid"
        />
      ),
    };
  }
  return defaultAlertProps;
};
