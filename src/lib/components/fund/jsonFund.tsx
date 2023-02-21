import { Box } from "@chakra-ui/react";
import type { UseFormSetValue } from "react-hook-form";

import JsonInput from "lib/components/json/JsonInput";
import type { AttachFundsState } from "lib/types";

interface JsonFundProps {
  setValue: UseFormSetValue<AttachFundsState>;
  assetsJson: string;
}
export const JsonFund = ({ setValue, assetsJson }: JsonFundProps) => {
  const handleSetFundMsg = (value: string) => {
    setValue("assetsJson", value);
  };

  return (
    <Box>
      <JsonInput text={assetsJson} setText={handleSetFundMsg} height="160px" />
    </Box>
  );
};
