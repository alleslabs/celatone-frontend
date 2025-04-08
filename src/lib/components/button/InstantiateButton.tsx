import type { ButtonProps } from "@chakra-ui/react";
import type { PermissionAddresses } from "lib/types";

import { Button } from "@chakra-ui/react";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import { AccessConfigPermission } from "lib/types";
import { resolvePermission } from "lib/utils";
import { JSX } from "react";

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
      tooltipLabel: "",
      variant: buttonDisabledState,
      icon: undefined,
    };
  }
  if (isAllowed) {
    return {
      tooltipLabel: isWalletConnected
        ? "You can instantiate without opening proposal"
        : "You need to connect wallet to instantiate contract",
      variant: isWalletConnected ? "outline-primary" : buttonDisabledState,
      icon: <CustomIcon name="instantiate" />,
    };
  }
  return {
    tooltipLabel: isWalletConnected
      ? "Instantiate through proposal only (Coming Soon)"
      : "You need to connect wallet to open instantiate proposal",
    variant: buttonDisabledState,
    icon: <CustomIcon name="vote" />,
  };
};

export const InstantiateButton = ({
  instantiatePermission = AccessConfigPermission.UNKNOWN,
  permissionAddresses = [],
  codeId,
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

  const { tooltipLabel, variant, icon } = getInstantiateButtonProps(
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
