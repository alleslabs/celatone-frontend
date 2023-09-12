import { useState } from "react";

import { AbiForm, type AbiFormData } from "lib/components/abi";
import type { ExposedFunction } from "lib/types";
import { getAbiInitialData } from "lib/utils";

export const ExecuteArea = ({ fn }: { fn: ExposedFunction }) => {
  const [data, setData] = useState<AbiFormData>({
    typeArgs: getAbiInitialData(fn.generic_type_params.length),
    args: getAbiInitialData(fn.params.length),
  });
  const [, setErrors] = useState<[string, string][]>([]);

  return (
    <AbiForm
      fn={fn}
      initialData={data}
      propsOnChange={setData}
      propsOnErrors={setErrors}
    />
  );
};
