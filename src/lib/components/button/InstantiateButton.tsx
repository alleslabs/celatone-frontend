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
  isDisabled: boolean
): {
  tooltipLabel: string;
  variant: string;
  icon: JSX.Element | undefined;
} => {
  if (isAllowed) {
    return {
      tooltipLabel: isDisabled
        ? "You need to connect wallet to instantiate"
        : "You can instantiate without opening proposal",
      variant: "outline-primary",
      icon: <StyledIcon as={MdPerson} />,
    };
  }
  return {
    tooltipLabel: isDisabled
      ? ""
      : "Instantiate through proposal only (Coming Soon)",
    variant: "outline-gray",
    icon: isDisabled ? undefined : <StyledIcon as={MdHowToVote} />,
  };
};

export const InstantiateButton = ({
  instantiatePermission = InstantiatePermission.UNKNOWN,
  permissionAddresses = [],
  codeId,
  ...buttonProps
}: InstantiateButtonProps) => {
  const { address } = useWallet();
  const navigate = useInternalNavigate();
  const goToInstantiate = () =>
    navigate({ pathname: "/instantiate", query: { "code-id": codeId } });

  const isAllowed =
    permissionAddresses.includes(address as HumanAddr) ||
    instantiatePermission === InstantiatePermission.EVERYBODY;
  const isDisabled =
    instantiatePermission === InstantiatePermission.UNKNOWN || !address;

  const { tooltipLabel, variant, icon } = getInstantiateButtonProps(
    isAllowed,
    isDisabled
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
        disabled={!isAllowed}
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
