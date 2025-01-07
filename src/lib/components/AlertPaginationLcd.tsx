import { Alert, AlertDescription } from "@chakra-ui/react";

export const AlertPaginationLcd = () => (
  <Alert alignItems="center" variant="error">
    <AlertDescription wordBreak="break-word">
      Error fetching data from LCD. Please try again later.
    </AlertDescription>
  </Alert>
);
