import type { CodeLocalInfo } from "lib/stores/code";

import { CodeDetailsTemplateModal } from "./CodeDetailsTemplate";

interface EditCodeDetailsModalProps {
  codeLocalInfo: CodeLocalInfo;
  triggerElement: JSX.Element;
}
export const EditCodeDetailsModal = ({
  codeLocalInfo,
  triggerElement,
}: EditCodeDetailsModalProps) => (
  <CodeDetailsTemplateModal
    title="Edit Code Description"
    mainBtnTitle="Save"
    isNewCode={false}
    codeLocalInfo={codeLocalInfo}
    triggerElement={triggerElement}
  />
);
