import { Flex, Text } from "@chakra-ui/react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { SelectInput } from "lib/components/forms";
import type { AttachFundsState } from "lib/types";
import { AttachFundsType } from "lib/types";

import { JsonFund } from "./jsonFund";
import { SelectFund } from "./selectFund";

interface AttachFundContentProps {
  control: Control<AttachFundsState>;
  setValue: UseFormSetValue<AttachFundsState>;
}

const attachFundOptions = [
  {
    label: "No funds attached",
    value: AttachFundsType.ATTACH_FUNDS_NULL,
    disabled: false,
  },
  {
    label: "Select asset and fill amount",
    value: AttachFundsType.ATTACH_FUNDS_SELECT,
    disabled: false,
  },
  {
    label: "Provide JSON Asset List",
    value: AttachFundsType.ATTACH_FUNDS_JSON,
    disabled: false,
  },
];

const AttachFundContent = ({ control, setValue }: AttachFundContentProps) => {
  const [assetsSelect, assetsJson, attachFundOption] = useWatch({
    control,
    name: ["assetsSelect", "assetsJson", "attachFundOption"],
  });

  if (attachFundOption === AttachFundsType.ATTACH_FUNDS_SELECT) {
    return (
      <SelectFund
        assetsSelect={assetsSelect}
        control={control}
        setValue={setValue}
      />
    );
  }

  if (attachFundOption === AttachFundsType.ATTACH_FUNDS_JSON) {
    return <JsonFund setValue={setValue} assetsJson={assetsJson} />;
  }

  return null;
};

interface AttachFundProps {
  control: Control<AttachFundsState>;
  attachFundOption: AttachFundsType;
  setValue: UseFormSetValue<AttachFundsState>;
}

export const AttachFund = ({
  control,
  setValue,
  attachFundOption,
}: AttachFundProps) => {
  return (
    <>
      <Flex mb={6}>
        <SelectInput
          formLabel="Attach Funds"
          options={attachFundOptions}
          onChange={(value: AttachFundsType) =>
            setValue("attachFundOption", value)
          }
          initialSelected={attachFundOption.toString()}
          helperTextComponent={
            <Text variant="body3" color="text.dark">
              Only the input values in your selected{" "}
              <span style={{ fontWeight: 700 }}>
                &#x2018;Attach funds&#x2019;
              </span>{" "}
              option will be used.
            </Text>
          }
        />
      </Flex>
      <AttachFundContent control={control} setValue={setValue} />
    </>
  );
};
