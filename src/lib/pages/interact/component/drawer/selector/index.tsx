import type { DisplayMode } from "../types";

import { ModuleSelectorDisplay } from "./ModuleSelectorDisplay";
import type { ModuleSelectorInputProps } from "./ModuleSelectorInput";
import { ModuleSelectorInput } from "./ModuleSelectorInput";

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
