import { SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";

import { AbiForm, type AbiFormData } from "lib/components/abi";
import type { ExposedFunction } from "lib/types";
import { getAbiInitialData } from "lib/utils";

export const ViewArea = ({ fn }: { fn: ExposedFunction }) => {
  const [data, setData] = useState<AbiFormData>({
    typeArgs: getAbiInitialData(fn.generic_type_params.length),
    args: getAbiInitialData(fn.params.length),
  });
  const [, setErrors] = useState<[string, string][]>([]);

  return (
    <SimpleGrid columns={2} spacing={4}>
      <AbiForm
        fn={fn}
        initialData={data}
        propsOnChange={setData}
        propsOnErrors={setErrors}
      />
      <AbiForm
        fn={fn}
        initialData={data}
        propsOnChange={setData}
        propsOnErrors={setErrors}
      />
    </SimpleGrid>
  );
};
