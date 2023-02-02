import { Button } from "@chakra-ui/react";

interface ContractCmdButtonProps {
  cmd: string;
  onClickCmd: () => void;
}
export const ContractCmdButton = ({
  cmd,
  onClickCmd,
}: ContractCmdButtonProps) => {
  return (
    <Button
      variant="outline-gray"
      fontSize="12px"
      height="24px"
      px="10px"
      textColor="white"
      borderColor="pebble.700"
      borderRadius="16px"
      fontWeight="400"
      onClick={onClickCmd}
    >
      {cmd}
    </Button>
  );
};
