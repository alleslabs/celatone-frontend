import type { CodeLocalInfo } from "lib/stores/code";

import { CodeDetailsTemplateModal } from "./CodeDetailsTemplate";

interface SaveCodeDetailsModalProps {
  codeLocalInfo: CodeLocalInfo;
  triggerElement: JSX.Element;
}
export const SaveCodeDetailsModal = ({
  codeLocalInfo,
  triggerElement,
}: SaveCodeDetailsModalProps) => (
  <CodeDetailsTemplateModal
    title="Save New Code"
    helperText={`Save other stored codes to your "Saved Codes" list`}
    mainBtnTitle="Save New Code"
    isNewCode
    codeLocalInfo={codeLocalInfo}
    triggerElement={triggerElement}
  />
);
