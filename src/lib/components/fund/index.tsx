import { Flex, Text } from "@chakra-ui/react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { SelectInputBase } from "lib/components/forms";

import { ASSETS_JSON_STR, ASSETS_SELECT, ATTACH_FUNDS_OPTION } from "./data";
import { JsonFund } from "./JsonFund";
import { SelectFund } from "./SelectFund";
import type { AttachFundsState } from "./types";
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
    label: "Provide JSON Asset List",
    value: AttachFundsType.ATTACH_FUNDS_JSON,
  },
];

const AttachFundContent = ({ control, setValue }: AttachFundContentProps) => {
  const [assetsSelect, assetsJson, attachFundsOption] = useWatch({
    control,
    name: [ASSETS_SELECT, ASSETS_JSON_STR, ATTACH_FUNDS_OPTION],
  });

  switch (attachFundsOption) {
    case AttachFundsType.ATTACH_FUNDS_JSON:
      return (
        <JsonFund
          setValue={(value) => setValue(ASSETS_JSON_STR, value)}
          assetsJson={assetsJson}
        />
      );
    case AttachFundsType.ATTACH_FUNDS_SELECT:
      return (
        <SelectFund
          assetsSelect={assetsSelect}
          setValue={setValue}
          control={control}
        />
      );
    case AttachFundsType.ATTACH_FUNDS_NULL:
    default:
      return null;
  }
};

interface AttachFundProps {
  attachFundsOption: AttachFundsType;
  control: Control<AttachFundsState>;
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
        initialSelected={attachFundsOption}
        formLabel={showLabel ? "Attach Funds" : undefined}
        helperTextComponent={
          <Text variant="body3" color="text.dark">
            Only the input values in your selected{" "}
            <span style={{ fontWeight: 700 }}>
              &#x2018;Attach funds&#x2019;
            </span>{" "}
            option will be used.
          </Text>
        }
        onChange={(value: AttachFundsType) =>
          setValue(ATTACH_FUNDS_OPTION, value)
        }
        options={attachFundsOptions}
      />
    </Flex>
    <AttachFundContent setValue={setValue} control={control} />
  </>
);
