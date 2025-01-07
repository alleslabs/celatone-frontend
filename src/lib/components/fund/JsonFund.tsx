import JsonInput from "lib/components/json/JsonInput";

interface JsonFundProps {
  assetsJson: string;

  setValue: (value: string) => void;
}
export const JsonFund = ({ assetsJson, setValue }: JsonFundProps) => (
  <JsonInput minLines={12} setText={setValue} text={assetsJson} />
);
