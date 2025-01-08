import type { ImageProps } from "@chakra-ui/react";
import { Image, SkeletonCircle } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { useValidatorImage } from "lib/services/validator";
import type { Nullable, Validator } from "lib/types";

interface ValidatorImageProps {
  boxSize?: ImageProps["boxSize"];
  validator: Nullable<Validator>;
}

export const ValidatorImage = ({
  boxSize = 10,
  validator,
}: ValidatorImageProps) => {
  const { data, isLoading } = useValidatorImage(validator);

  if (isLoading) return <SkeletonCircle minWidth={boxSize} boxSize={boxSize} />;

  if (!validator || isUndefined(data) || isUndefined(validator.moniker)) {
    return (
      <Image
        minWidth={boxSize}
        alt="N/A"
        src="https://raw.githubusercontent.com/alleslabs/assets/main/webapp-assets/asset/na-token.svg"
        borderRadius="50%"
        boxSize={boxSize}
      />
    );
  }

  return (
    <Image
      minWidth={boxSize}
      alt={validator.moniker}
      fallbackSrc="https://assets.alleslabs.dev/webapp-assets/placeholder/validator.svg"
      fallbackStrategy="beforeLoadOrError"
      src={data}
      borderRadius="50%"
      boxSize={boxSize}
    />
  );
};
