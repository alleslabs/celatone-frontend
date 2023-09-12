import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";

import { AbiForm, ParamForm, type AbiFormData } from "lib/components/abi";
import type { ExposedFunction } from "lib/types";
import { getAbiInitialData } from "lib/utils";

export const ViewArea = ({ fn }: { fn: ExposedFunction }) => {
  const [data, setData] = useState<AbiFormData>({
    typeArgs: getAbiInitialData(fn.generic_type_params.length),
    args: getAbiInitialData(fn.params.length),
  });
  const [, setErrors] = useState<[string, string][]>([]);
  const [res, setRes] = useState<Record<string, string>>(
    getAbiInitialData(fn.return.length)
  );

  return (
    <Grid templateColumns="1fr 1fr" gap={4}>
      <GridItem>
        <AbiForm
          fn={fn}
          initialData={data}
          propsOnChange={setData}
          propsOnErrors={setErrors}
        />
      </GridItem>
      <GridItem>
        <ParamForm
          title="Return"
          params={fn.return}
          initialData={res}
          propsOnChange={setRes}
          isReadOnly
        />
      </GridItem>
    </Grid>
  );
};
