import { Alert, AlertDescription, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

export const CustomNetworkAlertInfo = () => (
  <Alert
    alignItems="flex-start"
    display="flex"
    flexDirection="column"
    gap={1}
    my={4}
    p={3}
    variant="info"
  >
    <AlertDescription display="flex" gap={2}>
      <CustomIcon boxSize={3} color="gray.600" name="info-circle" />
      <Text
        color="text.dark"
        lineHeight="normal"
        textAlign="left"
        variant="body3"
      >
        The added custom Rollup on Initiascan will only be stored locally on
        your device.
      </Text>
    </AlertDescription>
    <AlertDescription display="flex" gap={2}>
      <CustomIcon boxSize={3} color="gray.600" name="info-circle" />
      <Text
        color="text.dark"
        lineHeight="normal"
        textAlign="left"
        variant="body3"
      >
        You can edit these details later.
      </Text>
    </AlertDescription>
  </Alert>
);
