import { useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import { useCelatoneApp } from "lib/app-provider";

interface JsonEditorProps {
  value: string;
  setValue?: (value: string) => void;
  readOnly?: boolean;
  isValid: boolean;
  showLines: number;
}

const JsonEditor = ({
  value,
  setValue,
  readOnly = false,
  isValid,
  showLines,
}: JsonEditorProps) => {
  const editorRef = useRef<AceEditor>(null);
  const { theme } = useCelatoneApp();

  return (
    <AceEditor
      ref={editorRef}
      mode="json"
      theme={theme.jsonTheme}
      fontSize="14px"
      readOnly={readOnly}
      style={{
        width: "100%",
        background: "transparent",
        color: readOnly && !isValid ? "error.light" : "text.main",
        offset: 0,
      }}
      setOptions={{
        tabSize: 2,
        useWorker: false,
        showGutter: false,
        wrap: readOnly && !isValid,
        printMargin: false,
        minLines: showLines,
        maxLines: showLines,
      }}
      onChange={setValue}
      value={value}
      editorProps={{ $blockScrolling: true }}
    />
  );
};

export default JsonEditor;
