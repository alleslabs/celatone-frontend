import type { ButtonProps } from "@chakra-ui/react";
import { Button, chakra, Icon, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { MdHowToVote, MdPerson } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import type { HumanAddr, PermissionAddresses } from "lib/types";
import { InstantiatePermission } from "lib/types";

interface InstantiateButtonProps extends ButtonProps {
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
  codeId: number;
}

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  },
});

const getInstantiateButtonProps = (
  isAllowed: boolean,
  isUnknown: boolean,
  isWalletConnected: boolean
): {
  tooltipLabel: string;
  variant: string;
  icon: JSX.Element | undefined;
} => {
  if (isUnknown) {
    return {
      tooltipLabel: "",
      variant: "outline-gray",
      icon: undefined,
    };
  }
  if (isAllowed) {
    return {
      tooltipLabel: isWalletConnected
        ? "You can instantiate without opening proposal"
        : "You need to connect wallet to instantiate contract",
      variant: "outline-primary",
      icon: <StyledIcon as={MdPerson} />,
    };
  }
  return {
    tooltipLabel: isWalletConnected
      ? "Instantiate through proposal only (Coming Soon)"
      : "You need to connect wallet to open instantiate proposal",
    variant: "outline-gray",
    icon: <StyledIcon as={MdHowToVote} />,
  };
};

export const InstantiateButton = ({
  instantiatePermission = InstantiatePermission.UNKNOWN,
  permissionAddresses = [],
  codeId,
  ...buttonProps
}: InstantiateButtonProps) => {
  const { address, isWalletConnected } = useWallet();
  const navigate = useInternalNavigate();
  const goToInstantiate = () =>
    navigate({ pathname: "/instantiate", query: { "code-id": codeId } });

  const isAllowed =
    permissionAddresses.includes(address as HumanAddr) ||
    instantiatePermission === InstantiatePermission.EVERYBODY;

  /**
   * @todos use isDisabled when proposal flow is done
   */
  // const isDisabled =
  //   instantiatePermission === InstantiatePermission.UNKNOWN ||
  //   !isWalletConnected;

  const { tooltipLabel, variant, icon } = getInstantiateButtonProps(
    isAllowed,
    instantiatePermission === InstantiatePermission.UNKNOWN,
    isWalletConnected
  );

  return (
    <Tooltip
      hasArrow
      label={tooltipLabel}
      placement="top"
      arrowSize={8}
      bg="primary.dark"
    >
      <Button
        // Change to isDisabled when create proposal flow is done
        disabled={!isAllowed || !isWalletConnected}
        // disabled={isDisabled}
        variant={variant}
        leftIcon={icon}
        size="sm"
        onClick={isAllowed ? goToInstantiate : () => null}
        {...buttonProps}
      >
        Instantiate
      </Button>
    </Tooltip>
  );
};
