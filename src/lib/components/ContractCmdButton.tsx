import { Button } from "@chakra-ui/react";
import type { Option } from "lib/types";

interface ContractCmdButtonProps {
  cmd: Option<string>;
  onClickCmd: () => void;
}
export const ContractCmdButton = ({
  cmd,
  onClickCmd,
}: ContractCmdButtonProps) => (
  <Button
    variant="command-button"
    fontSize="12px"
    height="24px"
    borderRadius="16px"
    fontWeight={400}
    onClick={onClickCmd}
    color={cmd ? "text.main" : "text.disabled"}
  >
    {cmd || "undefined"}
  </Button>
);
