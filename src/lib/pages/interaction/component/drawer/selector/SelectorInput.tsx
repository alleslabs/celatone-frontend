import { Flex, Button } from "@chakra-ui/react";
import type { Dispatch, SetStateAction, KeyboardEvent } from "react";
import { useState, useMemo, useCallback } from "react";

import type {
  SelectedAddress,
  DisplayMode,
  ModuleSelectFunction,
} from "../types";
import {
  useConvertHexAddress,
  useValidateAddress,
  useExampleAddresses,
} from "lib/app-provider";
import { TextInput } from "lib/components/forms";
import { useValidateModuleInput } from "lib/pages/interaction/hooks/useValidateModuleInput";
import type { IndexedModule } from "lib/services/moduleService";
import { useAccountModules } from "lib/services/moduleService";
import type { MoveAccountAddr, HexAddr, HumanAddr, Option } from "lib/types";
import { bech32AddressToHex, splitModule, unpadHexAddress } from "lib/utils";

export interface ModuleSelectorInputProps {
  selectedAddress: SelectedAddress;
  setSelectedAddress: Dispatch<SetStateAction<SelectedAddress>>;
  handleModuleSelect: ModuleSelectFunction;
  setModules: Dispatch<SetStateAction<Option<IndexedModule[]>>>;
  setMode: Dispatch<SetStateAction<DisplayMode>>;
  closeModal: () => void;
}

export const ModuleSelectorInput = ({
  selectedAddress,
  setSelectedAddress,
  handleModuleSelect,
  setModules,
  setMode,
  closeModal,
}: ModuleSelectorInputProps) => {
  const [keyword, setKeyword] = useState(selectedAddress.address as string);
  const [error, setError] = useState("");
  const [addr, moduleName, functionName] = useMemo(
    () => splitModule(keyword),
    [keyword]
  );

  const convertHexAddr = useConvertHexAddress();
  const { validateHexAddress } = useValidateAddress();
  const validateModuleInput = useValidateModuleInput();
  const { user } = useExampleAddresses();
  const { refetch, isFetching } = useAccountModules({
    address: addr as MoveAccountAddr,
    moduleName,
    functionName,
    options: {
      refetchOnWindowFocus: false,
      enabled: false,
      refetchOnMount: true,
      retry: false,
      onSuccess: (data) => {
        setError("");
        setSelectedAddress(() => {
          const isHex = validateHexAddress(addr);
          return isHex
            ? {
                address: convertHexAddr(addr as HexAddr),
                hex: unpadHexAddress(addr as HexAddr),
              }
            : {
                address: addr as HumanAddr,
                hex: unpadHexAddress(bech32AddressToHex(addr as HumanAddr)),
              };
        });
        if (Array.isArray(data)) {
          setModules(data);
          setMode("display");
        } else {
          handleModuleSelect(data, data.searchedFn);
          closeModal();
          setMode("display");
        }
      },
      onError: (err) => setError((err as Error).message),
    },
  });

  const handleSubmit = useCallback(() => {
    if (keyword === selectedAddress.address || keyword === selectedAddress.hex)
      return setMode("display");

    const err = validateModuleInput(keyword);
    return err ? setError(err) : refetch();
  }, [
    selectedAddress.address,
    selectedAddress.hex,
    keyword,
    refetch,
    validateModuleInput,
    setMode,
  ]);

  const handleKeydown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Flex
      className="selector-input"
      justifyContent="space-between"
      bgColor="gray.800"
      p={4}
      mb={6}
      gap={4}
      borderRadius={8}
    >
      <TextInput
        value={keyword}
        setInputState={setKeyword}
        error={error}
        size="md"
        helperText={`ex. “${user}”, “${user}::module_name”, or “${user}::module_name::function_name”`}
        label="Fill in address or module path"
        variant="fixed-floating"
        labelBgColor="gray.800"
        onKeyDown={handleKeydown}
        autoFocus
      />
      <Flex gap={2}>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isDisabled={!keyword.length || isFetching}
          isLoading={isFetching}
        >
          Submit
        </Button>
        <Button
          variant="outline-white"
          onClick={() =>
            selectedAddress.address ? setMode("display") : closeModal()
          }
        >
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};
