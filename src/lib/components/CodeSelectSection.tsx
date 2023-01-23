import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { CodeSelect } from "lib/pages/instantiate/component";
import type { Option } from "lib/types";

import { ControllerInput } from "./forms";

interface CodeSelectSectionProps<T extends FieldValues> {
  codeId: string;
  name: FieldPath<T>;
  control: Control<T>;
  error: Option<string>;
  onCodeSelect: (codeId: string) => void;
}

export const CodeSelectSection = <T extends FieldValues>({
  codeId,
  name,
  control,
  error,
  onCodeSelect,
}: CodeSelectSectionProps<T>) => {
  const [method, setMethod] = useState<"select-existing" | "fill-manually">(
    "select-existing"
  );

  return (
    <>
      <RadioGroup
        onChange={(nextVal: "select-existing" | "fill-manually") =>
          setMethod(nextVal)
        }
        value={method}
        w="100%"
      >
        <Flex justify="space-around">
          <Radio value="select-existing" size="lg">
            Select from your code
          </Radio>
          <Radio value="fill-manually" size="lg">
            Fill Code ID manually
          </Radio>
        </Flex>
      </RadioGroup>
      <form style={{ width: "100%" }}>
        {method === "select-existing" ? (
          <CodeSelect
            mt="16px"
            mb="32px"
            onCodeSelect={onCodeSelect}
            codeId={codeId}
          />
        ) : (
          <ControllerInput
            name={name}
            control={control}
            error={!codeId ? error : undefined}
            label="Code ID"
            helperText="Input existing Code ID manually"
            variant="floating"
            my="32px"
            rules={{ required: "Code ID is required" }}
          />
        )}
      </form>
    </>
  );
};
