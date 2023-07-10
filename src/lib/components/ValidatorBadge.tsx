import type { ImageProps } from "@chakra-ui/react";
import { Flex, Image, Text } from "@chakra-ui/react";

import { CURR_THEME } from "env";
import { useCelatoneApp } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ValidatorInfo } from "lib/types";
import { removeSpecialChars } from "lib/utils";

interface ValidatorBadgeProps {
  validator: ValidatorInfo | null;
  badgeSize?: ImageProps["boxSize"];
  ampCopierSection?: string;
}

const FallbackRender = ({
  badgeSize,
}: {
  badgeSize: ValidatorBadgeProps["badgeSize"];
}) => (
  <>
    <Image
      boxSize={badgeSize}
      src="https://raw.githubusercontent.com/alleslabs/assets/main/webapp-assets/asset/na-token.svg"
      alt="N/A"
      borderRadius="50%"
    />
    <Text variant="body2" color="text.disabled">
      N/A
    </Text>
  </>
);

export const ValidatorBadge = ({
  validator,
  badgeSize = 10,
  ampCopierSection,
}: ValidatorBadgeProps) => {
  const {
    chainConfig: { chain },
  } = useCelatoneApp();
  return (
    <Flex alignItems="center" gap={2}>
      {validator ? (
        <>
          <Image
            boxSize={badgeSize}
            src={`https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/${chain}/moniker/${validator.validatorAddress}.png`}
            alt={validator.moniker}
            fallbackSrc={`https://ui-avatars.com/api/?name=${removeSpecialChars(
              validator.moniker ?? ""
            )}&background=${CURR_THEME.colors.secondary.main.replace(
              "#",
              ""
            )}&color=fff`}
            borderRadius="50%"
          />
          <ExplorerLink
            value={validator.moniker ?? validator.validatorAddress}
            copyValue={validator.validatorAddress}
            type="validator_address"
            textFormat="ellipsis"
            showCopyOnHover
            ampCopierSection={ampCopierSection}
          />
        </>
      ) : (
        <FallbackRender badgeSize={badgeSize} />
      )}
    </Flex>
  );
};
