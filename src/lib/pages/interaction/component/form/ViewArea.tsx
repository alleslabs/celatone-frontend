import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";

import { AbiForm, ArgsForm } from "lib/components/abi";
import type { AbiFormData, ExposedFunction, Option } from "lib/types";
import { getAbiInitialData } from "lib/utils";

export const ViewArea = ({ fn }: { fn: ExposedFunction }) => {
  const [data, setData] = useState<AbiFormData>({
    typeArgs: getAbiInitialData(fn.generic_type_params.length),
    args: getAbiInitialData(fn.params.length),
  });
  const [, setErrors] = useState<[string, string][]>([]);
  const [res, setRes] = useState<Record<string, Option<string>>>(
    getAbiInitialData(fn.return.length)
  );

  return (
    <Grid templateColumns="1fr 1fr" gap={6}>
      <GridItem>
        <AbiForm
          fn={fn}
          initialData={data}
          propsOnChange={setData}
          propsOnErrors={setErrors}
        />
      </GridItem>
      <GridItem>
        <ArgsForm
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
