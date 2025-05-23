import type { FormStatus } from "lib/components/forms";
import type { Code } from "lib/services/types";
import type { Option } from "lib/types";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import { useState } from "react";

import { CodeSelect } from "./CodeSelect";

interface CodeSelectSectionProps<T extends FieldValues> {
  codeId: Option<number>;
  control: Control<T>;
  error: Option<string>;
  name: FieldPath<T>;
  onCodeSelect: (codeId: number) => void;
  setCodeHash: (data: Code) => void;
  status: FormStatus;
}

export const CodeSelectSection = <T extends FieldValues>({
  codeId,
  control,
  error,
  name,
  onCodeSelect,
  setCodeHash,
  status,
}: CodeSelectSectionProps<T>) => {
  const { isFullTier } = useTierConfig();
  const [method, setMethod] = useState<"fill-manually" | "select-existing">(
    isFullTier ? "select-existing" : "fill-manually"
  );

  return (
    <>
      {isFullTier && (
        <RadioGroup
          value={method}
          w="100%"
          onChange={(nextVal: "fill-manually" | "select-existing") => {
            track(
              nextVal === "fill-manually"
                ? AmpEvent.USE_CODE_FILL
                : AmpEvent.USE_CODE_SELECT
            );
            setMethod(nextVal);
          }}
        >
          <Flex justify="space-around">
            <Radio value="select-existing">Select from your code</Radio>
            <Radio value="fill-manually">Fill code ID manually</Radio>
          </Flex>
        </RadioGroup>
      )}
      <form style={{ width: "100%" }}>
        {method === "select-existing" ? (
          <CodeSelect
            codeId={codeId}
            mb={8}
            mt={4}
            setCodeHash={setCodeHash}
            status={status}
            onCodeSelect={onCodeSelect}
          />
        ) : (
          <ControllerInput
            control={control}
            error={error}
            helperText="Input existing code ID manually"
            label="Code ID"
            my={8}
            name={name}
            placeholder="ex. 1234"
            rules={{ required: "Code ID is required" }}
            status={status}
            type="number"
            variant="fixed-floating"
          />
        )}
      </form>
    </>
  );
};
