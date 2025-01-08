import { useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import { useCelatoneApp } from "lib/app-provider";

interface JsonEditorProps {
  isValid: boolean;
  readOnly?: boolean;
  setValue?: (value: string) => void;
  showLines: number;
  value: string;
}

const JsonEditor = ({
  isValid,
  readOnly = false,
  setValue,
  showLines,
  value,
}: JsonEditorProps) => {
  const editorRef = useRef<AceEditor>(null);
  const { theme } = useCelatoneApp();

  return (
    <AceEditor
      style={{
        background: "transparent",
        color: readOnly && !isValid ? "error.light" : "text.main",
        offset: 0,
        width: "100%",
      }}
      readOnly={readOnly}
      theme={theme.jsonTheme}
      value={value}
      editorProps={{ $blockScrolling: true }}
      fontSize="14px"
      mode="json"
      onChange={setValue}
      setOptions={{
        maxLines: showLines,
        minLines: showLines,
        printMargin: false,
        showGutter: false,
        tabSize: 2,
        useWorker: false,
        wrap: readOnly && !isValid,
      }}
      ref={editorRef}
    />
  );
};

export default JsonEditor;
