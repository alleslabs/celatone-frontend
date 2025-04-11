import type { ImageProps } from "@chakra-ui/react";
import type { Nullable, Validator } from "lib/types";

import { Image, SkeletonCircle } from "@chakra-ui/react";
import { useValidatorImage } from "lib/services/validator";
import { isUndefined } from "lodash";

interface ValidatorImageProps {
  validator: Nullable<Validator>;
  boxSize?: ImageProps["boxSize"];
}

export const ValidatorImage = ({
  validator,
  boxSize = 10,
}: ValidatorImageProps) => {
  const { data, isLoading } = useValidatorImage(validator);

  if (isLoading) return <SkeletonCircle boxSize={boxSize} minWidth={boxSize} />;

  if (!validator || isUndefined(data) || isUndefined(validator.moniker)) {
    return (
      <Image
        alt="N/A"
        borderRadius="50%"
        boxSize={boxSize}
        minWidth={boxSize}
        src="https://raw.githubusercontent.com/alleslabs/assets/main/webapp-assets/asset/na-token.svg"
      />
    );
  }

  return (
    <Image
      alt={validator.moniker}
      borderRadius="50%"
      boxSize={boxSize}
      fallbackSrc="https://assets.alleslabs.dev/webapp-assets/placeholder/validator.svg"
      fallbackStrategy="beforeLoadOrError"
      minWidth={boxSize}
      src={data}
    />
  );
};
