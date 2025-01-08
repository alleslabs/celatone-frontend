import { Button } from "@chakra-ui/react";

interface ContractCmdButtonProps {
  cmd: string;
  onClickCmd: () => void;
}
export const ContractCmdButton = ({
  cmd,
  onClickCmd,
}: ContractCmdButtonProps) => (
  <Button
    height="24px"
    variant="command-button"
    borderRadius="16px"
    color={cmd ? "text.main" : "text.disabled"}
    fontSize="12px"
    fontWeight={400}
    onClick={onClickCmd}
  >
    {cmd || "undefined"}
  </Button>
);
