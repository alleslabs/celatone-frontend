import type { ImageProps } from "@chakra-ui/react";
import { Image, SkeletonCircle } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { useValidatorImage } from "lib/services/validator";
import type { Nullable, Validator } from "lib/types";

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
        boxSize={boxSize}
        minWidth={boxSize}
        src="https://raw.githubusercontent.com/alleslabs/assets/main/webapp-assets/asset/na-token.svg"
        alt="N/A"
        borderRadius="50%"
      />
    );
  }

  return (
    <Image
      boxSize={boxSize}
      minWidth={boxSize}
      src={data}
      alt={validator.moniker}
      borderRadius="50%"
      fallbackSrc="https://assets.alleslabs.dev/webapp-assets/placeholder/validator.svg"
      fallbackStrategy="beforeLoadOrError"
    />
  );
};
