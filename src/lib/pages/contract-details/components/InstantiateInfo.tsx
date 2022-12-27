import { Flex, Heading } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";

export const InstantiateInfo = () => {
  /**
   * @todos
   * - Make an interface
   * - All these are mockups, Wireup with real data and map render LabelText
   */
  return (
    <Flex direction="column" gap={6} w="160px">
      <Heading as="h6" variant="h6">
        Instantiate Info
      </Heading>
      <LabelText label="Network">phoenix-1</LabelText>
      <LabelText label="Instantiated by" helperText="(Wallet Address)">
        <ExplorerLink
          type="user_address"
          value="osmo1wke7j8f5kgnnacs3avchcj6fvvdtvrsalzmddx"
          canCopyWithHover
        />
      </LabelText>
      <LabelText label="IBC Port ID">
        wasm.terra1te47jv6pg272n8unq490nvhh5m43v5n5kxfgrztly2tmkmqxzw8qphrjx2
      </LabelText>
    </Flex>
  );
};
