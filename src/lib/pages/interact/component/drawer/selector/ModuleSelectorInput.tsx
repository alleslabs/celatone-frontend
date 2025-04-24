import type { IndexedModule, Option } from "lib/types";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";

import { Button, Flex } from "@chakra-ui/react";
import { trackUseModuleSelectionInputFill } from "lib/amplitude";
import { useExampleAddresses } from "lib/app-provider";
import { TextInput } from "lib/components/forms";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useSearchModules } from "lib/pages/interact/data";
import { useValidateModuleInput } from "lib/pages/interact/hooks/useValidateModuleInput";
import { splitModulePath } from "lib/utils";
import { useCallback, useMemo, useState } from "react";

import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "../types";

export interface ModuleSelectorInputProps {
  closeModal: () => void;
  handleModuleSelect: ModuleSelectFunction;
  selectedAddress: SelectedAddress;
  setMode: Dispatch<SetStateAction<DisplayMode>>;
  setModules: Dispatch<SetStateAction<Option<IndexedModule[]>>>;
  setSelectedAddress: Dispatch<SetStateAction<SelectedAddress>>;
}

export const ModuleSelectorInput = ({
  closeModal,
  handleModuleSelect,
  selectedAddress,
  setMode,
  setModules,
  setSelectedAddress,
}: ModuleSelectorInputProps) => {
  const [keyword, setKeyword] = useState(selectedAddress.hex as string);
  const [error, setError] = useState("");
  const [addr, moduleName, functionName] = useMemo(
    () => splitModulePath(keyword),
    [keyword]
  );

  const formatAddresses = useFormatAddresses();
  const onSuccessCallback = useCallback(() => {
    setError("");
    setSelectedAddress(formatAddresses(addr));
    setMode("display");
  }, [addr, formatAddresses, setMode, setSelectedAddress]);

  const { isFetching, refetch } = useSearchModules({
    address: addr,
    moduleName,
    onError: (err) => setError((err as Error).message),
    onModulesSuccess: (data) => {
      setModules(data);
      onSuccessCallback();
    },
    onModuleSuccess: (data) => {
      const searchedFn = functionName
        ? data.parsedAbi.exposed_functions.find(
            (fn) => fn.name === functionName
          )
        : undefined;
      handleModuleSelect(data, searchedFn);
      onSuccessCallback();
      closeModal();
    },
  });

  const validateModuleInput = useValidateModuleInput();
  const { user } = useExampleAddresses();

  const handleSubmit = useCallback(() => {
    trackUseModuleSelectionInputFill(addr, !!moduleName, !!functionName);

    if (keyword === selectedAddress.address || keyword === selectedAddress.hex)
      return setMode("display");

    const err = validateModuleInput(keyword);
    return err ? setError(err) : refetch();
  }, [
    addr,
    moduleName,
    functionName,
    keyword,
    selectedAddress.address,
    selectedAddress.hex,
    setMode,
    validateModuleInput,
    refetch,
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
      bgColor="gray.800"
      borderRadius={8}
      direction={{ base: "column", md: "row" }}
      gap={{ base: 2, md: 4 }}
      justifyContent="space-between"
      mb={6}
      p={4}
    >
      <TextInput
        error={error}
        helperText={`ex. “${user}”, “${user}::module_name”, or “${user}::module_name::function_name”`}
        isDisabled={isFetching}
        label="Fill in address or module path"
        labelBgColor="gray.800"
        setInputState={setKeyword}
        size="md"
        value={keyword}
        variant="fixed-floating"
        onKeyDown={handleKeydown}
      />
      <Flex gap={2} mt={{ base: 1, md: 0 }} w={{ base: "full", md: "auto" }}>
        <Button
          isDisabled={!keyword.length || isFetching}
          isLoading={isFetching}
          size={{ base: "sm", md: "md" }}
          variant="primary"
          w={{ base: "full", md: "auto" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          size={{ base: "sm", md: "md" }}
          variant="outline-white"
          w={{ base: "full", md: "auto" }}
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
