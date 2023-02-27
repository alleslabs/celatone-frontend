import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { ControllerInput } from "lib/components/forms";
import type { FormStatus } from "lib/components/forms";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Option } from "lib/types";

import { CodeSelect } from "./CodeSelect";

interface CodeSelectSectionProps<T extends FieldValues> {
  codeId: string;
  name: FieldPath<T>;
  control: Control<T>;
  error: Option<string>;
  onCodeSelect: (codeId: string) => void;
  status: FormStatus;
}

export const CodeSelectSection = <T extends FieldValues>({
  codeId,
  name,
  control,
  error,
  onCodeSelect,
  status,
}: CodeSelectSectionProps<T>) => {
  const [method, setMethod] = useState<"select-existing" | "fill-manually">(
    "select-existing"
  );

  return (
    <>
      <RadioGroup
        onChange={(nextVal: "select-existing" | "fill-manually") => {
          AmpTrack(
            nextVal === "fill-manually"
              ? AmpEvent.USE_CODE_FILL
              : AmpEvent.USE_CODE_SELECT
          );
          setMethod(nextVal);
        }}
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
            status={status}
          />
        ) : (
          <ControllerInput
            name={name}
            control={control}
            type="number"
            status={status}
            error={error}
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
