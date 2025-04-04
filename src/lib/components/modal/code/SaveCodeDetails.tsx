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
    title="Save new code"
    helperText={`Save other stored codes to your "Saved codes" list`}
    mainBtnTitle="Save new code"
    isNewCode
    codeInfo={codeInfo}
    triggerElement={triggerElement}
  />
);
