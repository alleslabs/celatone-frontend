import JsonInput from "lib/components/json/JsonInput";

interface JsonFundProps {
  setValue: (value: string) => void;

  assetsJson: string;
}
export const JsonFund = ({ setValue, assetsJson }: JsonFundProps) => (
  <JsonInput minLines={12} setText={setValue} text={assetsJson} />
);
