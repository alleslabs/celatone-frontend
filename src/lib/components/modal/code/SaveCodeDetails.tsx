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
    codeInfo={codeInfo}
    helperText={`Save other stored codes to your "Saved Codes" list`}
    isNewCode
    mainBtnTitle="Save New Code"
    title="Save New Code"
    triggerElement={triggerElement}
  />
);
