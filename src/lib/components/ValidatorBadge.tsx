import type { ImageProps } from "@chakra-ui/react";
import { Spinner, Flex, Image, Text } from "@chakra-ui/react";

import validatorDefaultImg from "../../../public/validator.svg";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { useValidatorImage } from "lib/services/validatorService";
import type { ValidatorInfo } from "lib/types";

interface ValidatorBadgeProps {
  validator: ValidatorInfo | null;
  badgeSize?: ImageProps["boxSize"];
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
}: ValidatorBadgeProps) => {
  const { data: valImgSrc, isLoading } = useValidatorImage(validator);

  return (
    <Flex alignItems="center" gap={2}>
      {validator ? (
        <>
          {isLoading ? (
            <Spinner boxSize={badgeSize} />
          ) : (
            <Image
              boxSize={badgeSize}
              src={valImgSrc}
              alt={validator.moniker}
              borderRadius="50%"
              fallbackSrc={validatorDefaultImg.src}
              fallbackStrategy="onError"
            />
          )}
          <ExplorerLink
            value={validator.moniker ?? validator.validatorAddress}
            copyValue={validator.validatorAddress}
            type="validator_address"
            textFormat="ellipsis"
            showCopyOnHover
          />
        </>
      ) : (
        <FallbackRender badgeSize={badgeSize} />
      )}
    </Flex>
  );
};
