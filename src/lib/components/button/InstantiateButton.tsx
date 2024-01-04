import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import type { PermissionAddresses } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { resolvePermission } from "lib/utils";

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
      icon: (
        <CustomIcon
          name="instantiate"
          color={isWalletConnected ? "primary.light" : "gray.600"}
        />
      ),
    };
  }
  return {
    tooltipLabel: isWalletConnected
      ? "Instantiate through proposal only (Coming Soon)"
      : "You need to connect wallet to open instantiate proposal",
    variant: "outline-gray",
    icon: <CustomIcon name="vote" />,
  };
};

export const InstantiateButton = ({
  instantiatePermission = AccessConfigPermission.UNKNOWN,
  permissionAddresses = [],
  codeId,
  ...buttonProps
}: InstantiateButtonProps) => {
  const { address, isWalletConnected } = useCurrentChain();
  const navigate = useInternalNavigate();
  const goToInstantiate = () =>
    navigate({ pathname: "/instantiate", query: { "code-id": codeId } });

  const isAllowed = resolvePermission(
    address,
    instantiatePermission,
    permissionAddresses
  );

  /**
   * @todos use isDisabled when proposal flow is done
   */
  // const isDisabled =
  //   instantiatePermission === AccessConfigPermission.UNKNOWN ||
  //   !isWalletConnected;

  const { tooltipLabel, variant, icon } = getInstantiateButtonProps(
    isAllowed,
    instantiatePermission === AccessConfigPermission.UNKNOWN,
    isWalletConnected
  );

  return (
    <Tooltip label={tooltipLabel}>
      <Button
        w={{ base: "full", md: "auto" }}
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
