import type { CodeInfo } from "lib/types";

import { CodeDetailsTemplateModal } from "./CodeDetailsTemplate";

interface SaveCodeDetailsModalProps {
  codeInfo: CodeInfo;
  triggerElement: JSX.Element;
}
export const SaveCodeDetailsModal = ({
  codeInfo,
  triggerElement,
}: SaveCodeDetailsModalProps) => (
  <CodeDetailsTemplateModal
    title="Save New Code"
    helperText={`Save other stored codes to your "Saved Codes" list`}
    mainBtnTitle="Save New Code"
    isNewCode
    codeInfo={codeInfo}
    triggerElement={triggerElement}
  />
);
