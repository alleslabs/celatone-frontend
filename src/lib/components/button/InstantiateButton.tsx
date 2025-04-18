import type { ButtonProps } from "@chakra-ui/react";
import type { PermissionAddresses } from "lib/types";

import { Button } from "@chakra-ui/react";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import { AccessConfigPermission } from "lib/types";
import { resolvePermission } from "lib/utils";

import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";

interface InstantiateButtonProps extends ButtonProps {
  instantiatePermission: AccessConfigPermission;
  permissionAddresses: PermissionAddresses;
  codeId: number;
}

const getInstantiateButtonProps = (
  isAllowed: boolean,
  isUnknown: boolean,
  isWalletConnected: boolean
): {
  tooltipLabel: string;
  variant: string;
  icon: JSX.Element | undefined;
} => {
  const buttonDisabledState = "outline-gray";
  if (isUnknown) {
    return {
      icon: undefined,
      tooltipLabel: "",
      variant: buttonDisabledState,
    };
  }
  if (isAllowed) {
    return {
      icon: <CustomIcon name="instantiate" />,
      tooltipLabel: isWalletConnected
        ? "You can instantiate without opening proposal"
        : "You need to connect wallet to instantiate contract",
      variant: isWalletConnected ? "outline-primary" : buttonDisabledState,
    };
  }
  return {
    icon: <CustomIcon name="vote" />,
    tooltipLabel: isWalletConnected
      ? "Instantiate through proposal only (Coming Soon)"
      : "You need to connect wallet to open instantiate proposal",
    variant: buttonDisabledState,
  };
};

export const InstantiateButton = ({
  codeId,
  instantiatePermission = AccessConfigPermission.UNKNOWN,
  permissionAddresses = [],
  ...buttonProps
}: InstantiateButtonProps) => {
  const { address } = useCurrentChain();
  const navigate = useInternalNavigate();
  const goToInstantiate = () =>
    navigate({ pathname: "/instantiate", query: { codeId } });

  const isAllowed = resolvePermission(
    address,
    instantiatePermission,
    permissionAddresses
  );

  // TODO: use isDisabled when proposal flow is done
  // const isDisabled =
  //   instantiatePermission === AccessConfigPermission.UNKNOWN ||
  //   !isWalletConnected;

  const { icon, tooltipLabel, variant } = getInstantiateButtonProps(
    isAllowed,
    instantiatePermission === AccessConfigPermission.UNKNOWN,
    !!address
  );

  return (
    <Tooltip label={tooltipLabel}>
      <Button
        // Change to isDisabled when create proposal flow is done
        isDisabled={!isAllowed || !address}
        leftIcon={icon}
        size="sm"
        variant={variant}
        w={{ base: "full", md: "auto" }}
        onClick={isAllowed ? goToInstantiate : () => null}
        {...buttonProps}
      >
        Instantiate
      </Button>
    </Tooltip>
  );
};
