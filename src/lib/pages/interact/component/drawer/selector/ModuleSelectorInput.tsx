import { Button, Flex } from "@chakra-ui/react";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";

import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "../types";
import { trackUseModuleSelectionInputFill } from "lib/amplitude";
import { useExampleAddresses } from "lib/app-provider";
import { TextInput } from "lib/components/forms";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useValidateModuleInput } from "lib/pages/interact/hooks/useValidateModuleInput";
import type { IndexedModule } from "lib/services/move/moduleService";
import { useAccountModules } from "lib/services/move/moduleService";
import type { Option } from "lib/types";
import { splitModule } from "lib/utils";

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
    () => splitModule(keyword),
    [keyword]
  );

  const formatAddresses = useFormatAddresses();
  const validateModuleInput = useValidateModuleInput();
  const { user } = useExampleAddresses();
  const { refetch, isFetching } = useAccountModules({
    address: addr,
    moduleName,
    functionName,
    options: {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
      onSuccess: (data) => {
        setError("");
        setSelectedAddress(formatAddresses(addr));
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
