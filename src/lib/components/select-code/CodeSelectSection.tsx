import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import type { FormStatus } from "lib/components/forms";
import type { Code } from "lib/services/types";
import type { Option } from "lib/types";

import { CodeSelect } from "./CodeSelect";

interface CodeSelectSectionProps<T extends FieldValues> {
  codeId: Option<number>;
  name: FieldPath<T>;
  control: Control<T>;
  error: Option<string>;
  onCodeSelect: (codeId: number) => void;
  setCodeHash: (data: Code) => void;
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
  const { isFullTier } = useTierConfig();
  const [method, setMethod] = useState<"select-existing" | "fill-manually">(
    isFullTier ? "select-existing" : "fill-manually"
  );

  return (
    <>
      {isFullTier && (
        <RadioGroup
          onChange={(nextVal: "select-existing" | "fill-manually") => {
            track(
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
            <Radio value="fill-manually">Fill code ID manually</Radio>
          </Flex>
        </RadioGroup>
      )}
      <form style={{ width: "100%" }}>
        {method === "select-existing" ? (
          <CodeSelect
            codeId={codeId}
            onCodeSelect={onCodeSelect}
            setCodeHash={setCodeHash}
            status={status}
            mb={8}
            mt={4}
          />
        ) : (
          <ControllerInput
            name={name}
            control={control}
            type="number"
            status={status}
            error={error}
            label="Code ID"
            helperText="Input existing code ID manually"
            variant="fixed-floating"
            placeholder="ex. 1234"
            my={8}
            rules={{ required: "Code ID is required" }}
          />
        )}
      </form>
    </>
  );
};
