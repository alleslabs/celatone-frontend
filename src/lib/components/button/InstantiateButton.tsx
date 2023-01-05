import type { ButtonProps } from "@chakra-ui/react";
import { Button, chakra, Icon, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdHowToVote, MdPerson } from "react-icons/md";

// TODO: change permission type
interface InstantiateButtonProps extends ButtonProps {
  permission: "any" | "else";
  codeId: number;
}

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  },
});

export const InstantiateButton = ({
  permission = "any",
  codeId,
  ...buttonProps
}: InstantiateButtonProps) => {
  const router = useRouter();
  const goToInstantiate = () =>
    router.push({ pathname: "/instantiate", query: { "code-id": codeId } });

  const isProposalOnly = permission !== "any";
  return (
    <Tooltip
      hasArrow
      label={
        isProposalOnly
          ? "Instantiate through proposal only"
          : "You can instantiate without opening proposal"
      }
      placement="top"
      arrowSize={8}
      bg="primary.dark"
    >
      <Button
        variant={isProposalOnly ? "outline-gray" : "outline-primary"}
        leftIcon={<StyledIcon as={isProposalOnly ? MdHowToVote : MdPerson} />}
        size="sm"
        onClick={isProposalOnly ? () => null : goToInstantiate}
        {...buttonProps}
      >
        Instantiate
      </Button>
    </Tooltip>
  );
};
