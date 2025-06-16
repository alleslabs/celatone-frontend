import type { Nullable } from "lib/types";
import type { ControllerRenderProps } from "react-hook-form";

export const boolOptions = [
  { label: "True", value: true },
  { label: "False", value: false },
];

export interface ArgFieldWidgetProps {
  onChange: ControllerRenderProps["onChange"];
  type: string;
  value: Nullable<unknown>;
}
