import { Alert, AlertDescription } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { MAX_TXS_PAGE_SIZE } from "lib/data";

export const TxsAlert = () => {
  return (
    <Alert gap={4} my={6} variant="error">
      <CustomIcon boxSize={4} color="error.main" name="alert-triangle-solid" />
      <AlertDescription>
        This account has a high volume of transactions. Kindly note that{" "}
        <span style={{ fontWeight: 700 }}>
          we are only able to display up to {MAX_TXS_PAGE_SIZE} recent filtered
          transactions
        </span>{" "}
        at the time due to the large number of transactions.
      </AlertDescription>
    </Alert>
  );
};
