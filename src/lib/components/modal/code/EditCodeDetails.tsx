import type { CodeLocalInfo } from "lib/stores/code";

import { CodeDetailsTemplate } from "./CodeDetailsTemplate";

interface EditCodeDetailsProps {
  codeLocalInfo: CodeLocalInfo;
  triggerElement: JSX.Element;
}
export const EditCodeDetails = ({
  codeLocalInfo,
  triggerElement,
}: EditCodeDetailsProps) => (
  <CodeDetailsTemplate
    title="Edit Code Description"
    mainBtnTitle="Save"
    codeLocalInfo={codeLocalInfo}
    triggerElement={triggerElement}
  />
);
