import type { DisplayMode } from "../types";
import type { ModuleSelectorInputProps } from "./ModuleSelectorInput";

import { ModuleSelectorDisplay } from "./ModuleSelectorDisplay";
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
      closeModal={closeModal}
      handleModuleSelect={handleModuleSelect}
      selectedAddress={selectedAddress}
      setMode={setMode}
      setModules={setModules}
      setSelectedAddress={setSelectedAddress}
    />
  );
};
