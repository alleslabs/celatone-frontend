import type { Control, UseFormSetValue } from "react-hook-form";

import { Flex, Text } from "@chakra-ui/react";
import { SelectInputBase } from "lib/components/forms";
import { useWatch } from "react-hook-form";

import type { AttachFundsState } from "./types";

import { ASSETS_JSON_STR, ASSETS_SELECT, ATTACH_FUNDS_OPTION } from "./data";
import { JsonFund } from "./JsonFund";
import { SelectFund } from "./SelectFund";
import { AttachFundsType } from "./types";

interface AttachFundContentProps {
  control: Control<AttachFundsState>;
  setValue: UseFormSetValue<AttachFundsState>;
}

const attachFundsOptions = [
  {
    disabled: false,
    label: "No funds attached",
    value: AttachFundsType.ATTACH_FUNDS_NULL,
  },
  {
    disabled: false,
    label: "Select asset and fill amount",
    value: AttachFundsType.ATTACH_FUNDS_SELECT,
  },
  {
    disabled: false,
    label: "Provide JSON asset list",
    value: AttachFundsType.ATTACH_FUNDS_JSON,
  },
];

const AttachFundContent = ({ control, setValue }: AttachFundContentProps) => {
  const [assetsSelect, assetsJson, attachFundsOption] = useWatch({
    control,
    name: [ASSETS_SELECT, ASSETS_JSON_STR, ATTACH_FUNDS_OPTION],
  });

  switch (attachFundsOption) {
    case AttachFundsType.ATTACH_FUNDS_SELECT:
      return (
        <SelectFund
          assetsSelect={assetsSelect}
          control={control}
          setValue={setValue}
        />
      );
    case AttachFundsType.ATTACH_FUNDS_JSON:
      return (
        <JsonFund
          assetsJson={assetsJson}
          setValue={(value) => setValue(ASSETS_JSON_STR, value)}
        />
      );
    case AttachFundsType.ATTACH_FUNDS_NULL:
    default:
      return null;
  }
};

interface AttachFundProps {
  control: Control<AttachFundsState>;
  attachFundsOption: AttachFundsType;
  setValue: UseFormSetValue<AttachFundsState>;
  showLabel?: boolean;
}

export const AttachFund = ({
  attachFundsOption,
  control,
  setValue,
  showLabel = true,
}: AttachFundProps) => (
  <>
    <Flex mb={5}>
      <SelectInputBase
        formLabel={showLabel ? "Attach funds" : undefined}
        helperTextComponent={
          <Text color="text.dark" variant="body3">
            Only the input values in your selected{" "}
            <span style={{ fontWeight: 700 }}>
              &#x2018;Attach funds&#x2019;
            </span>{" "}
            option will be used.
          </Text>
        }
        initialSelected={attachFundsOption}
        options={attachFundsOptions}
        onChange={(value: AttachFundsType) =>
          setValue(ATTACH_FUNDS_OPTION, value)
        }
      />
    </Flex>
    <AttachFundContent control={control} setValue={setValue} />
  </>
);
