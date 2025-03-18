import { Alert, AlertDescription } from "@chakra-ui/react";

export const AlertPaginationRest = () => (
  <Alert variant="error" alignItems="center">
    <AlertDescription wordBreak="break-word">
      Error fetching data from REST. Please try again later.
    </AlertDescription>
  </Alert>
);
