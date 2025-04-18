import { Button, Flex } from "@chakra-ui/react";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";

import { trackUseModuleSelectionInputFill } from "lib/amplitude";
import { useExampleAddresses } from "lib/app-provider";
import { TextInput } from "lib/components/forms";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useSearchModules } from "lib/pages/interact/data";
import { useValidateModuleInput } from "lib/pages/interact/hooks/useValidateModuleInput";
import type { IndexedModule, Option } from "lib/types";
import { splitModulePath } from "lib/utils";
import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "../types";

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

  const { refetch, isFetching } = useSearchModules({
    address: addr,
    moduleName,
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
    onModulesSuccess: (data) => {
      setModules(data);
      onSuccessCallback();
    },
    onError: (err) => setError((err as Error).message),
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
      justifyContent="space-between"
      bgColor="gray.800"
      p={4}
      mb={6}
      gap={{ base: 2, md: 4 }}
      borderRadius={8}
      direction={{ base: "column", md: "row" }}
    >
      <TextInput
        value={keyword}
        setInputState={setKeyword}
        isDisabled={isFetching}
        error={error}
        size="md"
        helperText={`ex. “${user}”, “${user}::module_name”, or “${user}::module_name::function_name”`}
        label="Fill in address or module path"
        variant="fixed-floating"
        labelBgColor="gray.800"
        onKeyDown={handleKeydown}
      />
      <Flex gap={2} w={{ base: "full", md: "auto" }} mt={{ base: 1, md: 0 }}>
        <Button
          variant="primary"
          w={{ base: "full", md: "auto" }}
          size={{ base: "sm", md: "md" }}
          onClick={handleSubmit}
          isDisabled={!keyword.length || isFetching}
          isLoading={isFetching}
        >
          Submit
        </Button>
        <Button
          variant="outline-white"
          w={{ base: "full", md: "auto" }}
          size={{ base: "sm", md: "md" }}
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
