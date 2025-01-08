import type { DisplayMode } from "../types";

import { ModuleSelectorDisplay } from "./ModuleSelectorDisplay";
import type { ModuleSelectorInputProps } from "./ModuleSelectorInput";
import { ModuleSelectorInput } from "./ModuleSelectorInput";

interface ModuleSelectorProps extends ModuleSelectorInputProps {
  mode: DisplayMode;
}

export const ModuleSelector = ({
  closeModal,
  handleModuleSelect,
  mode,
  selectedAddress,
  setMode,
  setModules,
  setSelectedAddress,
}: ModuleSelectorProps) => {
  const showDisplay = mode === "display" && Boolean(selectedAddress.address);
  return showDisplay ? (
    <ModuleSelectorDisplay
      selectedAddress={selectedAddress}
      setMode={setMode}
    />
  ) : (
    <ModuleSelectorInput
      selectedAddress={selectedAddress}
      setSelectedAddress={setSelectedAddress}
      closeModal={closeModal}
      handleModuleSelect={handleModuleSelect}
      setMode={setMode}
      setModules={setModules}
    />
  );
};
