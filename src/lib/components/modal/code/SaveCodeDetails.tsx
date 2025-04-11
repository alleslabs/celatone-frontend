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
    helperText={`Save other stored codes to your "Saved codes" list`}
    isNewCode
    mainBtnTitle="Save new code"
    title="Save new code"
    triggerElement={triggerElement}
  />
);
