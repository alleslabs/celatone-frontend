import type { ReactNode } from "react";

import { TableTitle } from "lib/components/table";
import type { Option } from "lib/types";

interface AccountSectionWrapperProps {
  children: ReactNode;
  title: string;
  totalData: Option<number>;
  helperText?: string;
  hasHelperText?: boolean;
}
const AccountSectionWrapper = ({
  children,
  title,
  totalData,
  helperText,
  hasHelperText,
}: AccountSectionWrapperProps) => (
  <>
    <TableTitle
      title={title}
      count={totalData}
      mb={2}
      helperText={hasHelperText ? helperText : undefined}
    />
    {children}
  </>
);

export default AccountSectionWrapper;
