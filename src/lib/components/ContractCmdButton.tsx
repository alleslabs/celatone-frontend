import { Button } from "@chakra-ui/react";

interface ContractCmdButtonProps {
  cmd: string;
  msg: string;
  setMsg: (msg: string) => void;
}
const ContractCmdButton = ({ cmd, msg, setMsg }: ContractCmdButtonProps) => {
  return (
    <Button
      variant="outline-gray"
      textColor="white"
      fontSize="12px"
      height="24px"
      px="10px"
      borderColor="rgba(255, 255, 255, 0.3)"
      borderRadius="16px"
      fontWeight="400"
      onClick={() => {
        setMsg(msg);
      }}
    >
      {cmd}
    </Button>
  );
};

export default ContractCmdButton;
