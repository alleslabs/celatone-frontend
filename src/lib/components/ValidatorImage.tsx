import type { ImageProps } from "@chakra-ui/react";
import { Image, SkeletonCircle } from "@chakra-ui/react";

import { useValidatorImage } from "lib/services/validatorService";
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

  if (!validator) {
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

  return isLoading || !data || !validator.moniker ? (
    <SkeletonCircle boxSize={boxSize} minWidth={boxSize} />
  ) : (
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
