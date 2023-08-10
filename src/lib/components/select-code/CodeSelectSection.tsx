import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { ControllerInput } from "lib/components/forms";
import type { FormStatus } from "lib/components/forms";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { LcdCodeInfoSuccessCallback } from "lib/services/codeService";
import type { Option } from "lib/types";

import { CodeSelect } from "./CodeSelect";

interface CodeSelectSectionProps<T extends FieldValues> {
  codeId: string;
  name: FieldPath<T>;
  control: Control<T>;
  error: Option<string>;
  onCodeSelect: (codeId: string) => void;
  setCodeHash?: LcdCodeInfoSuccessCallback;
  status: FormStatus;
}

export const CodeSelectSection = <T extends FieldValues>({
  codeId,
  name,
  control,
  error,
  onCodeSelect,
  setCodeHash,
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
          <Radio value="select-existing">Select from your code</Radio>
          <Radio value="fill-manually">Fill Code ID manually</Radio>
        </Flex>
      </RadioGroup>
      <form style={{ width: "100%" }}>
        {method === "select-existing" ? (
          <CodeSelect
            mt={4}
            mb={8}
            onCodeSelect={onCodeSelect}
            setCodeHash={setCodeHash}
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
            my={8}
            rules={{ required: "Code ID is required" }}
          />
        )}
      </form>
    </>
  );
};
