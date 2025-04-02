import { Alert, AlertDescription } from "@chakra-ui/react";

export const AlertPaginationRest = () => (
  <Alert alignItems="center" variant="error">
    <AlertDescription wordBreak="break-word">
      Error fetching data from REST. Please try again later.
    </AlertDescription>
  </Alert>
);
