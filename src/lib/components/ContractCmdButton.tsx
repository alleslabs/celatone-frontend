import type { Option } from "lib/types";

import { Button } from "@chakra-ui/react";

interface ContractCmdButtonProps {
  cmd: Option<string>;
  onClickCmd: () => void;
}
export const ContractCmdButton = ({
  cmd,
  onClickCmd,
}: ContractCmdButtonProps) => (
  <Button
    borderRadius="16px"
    color={cmd ? "text.main" : "text.disabled"}
    fontSize="12px"
    fontWeight={400}
    height="24px"
    variant="command-button"
    onClick={onClickCmd}
  >
    {cmd || "undefined"}
  </Button>
);
