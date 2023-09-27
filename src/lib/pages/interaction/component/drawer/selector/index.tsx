import type { DisplayMode } from "../types";

import { ModuleSelectorDisplay } from "./SelectorDisplay";
import type { ModuleSelectorInputProps } from "./SelectorInput";
import { ModuleSelectorInput } from "./SelectorInput";

interface ModuleSelectorProps extends ModuleSelectorInputProps {
  mode: DisplayMode;
}

export const ModuleSelector = ({
  mode,
  selectedAddress,
  setSelectedAddress,
  setMode,
  setModules,
  handleModuleSelect,
  closeModal,
}: ModuleSelectorProps) => {
  const showDisplay = mode === "display" && Boolean(selectedAddress.address);
  return showDisplay ? (
    <ModuleSelectorDisplay
      selectedAddress={selectedAddress}
      setMode={setMode}
    />
  ) : (
    <ModuleSelectorInput
      setModules={setModules}
      closeModal={closeModal}
      selectedAddress={selectedAddress}
      setSelectedAddress={setSelectedAddress}
      setMode={setMode}
      handleModuleSelect={handleModuleSelect}
    />
  );
};
