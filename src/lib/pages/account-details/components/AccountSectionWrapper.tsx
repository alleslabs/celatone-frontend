import type { ReactNode } from "react";

import { TableTitle } from "lib/components/table";
import type { Option } from "lib/types";

interface AccountSectionWrapperProps {
  children: ReactNode;
  hasHelperText?: boolean;
  helperText?: string;
  showCount?: boolean;
  title: string;
  totalData?: Option<number>;
}
const AccountSectionWrapper = ({
  children,
  hasHelperText,
  helperText,
  showCount = true,
  title,
  totalData,
}: AccountSectionWrapperProps) => (
  <>
    <TableTitle
      helperText={hasHelperText ? helperText : undefined}
      mb={2}
      title={title}
      count={totalData}
      showCount={showCount}
    />
    {children}
  </>
);

export default AccountSectionWrapper;
