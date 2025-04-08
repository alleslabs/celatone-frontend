import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

import { useCelatoneApp } from "lib/app-provider";
import { useRef } from "react";
import AceEditor from "react-ace";

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
      style={{
        width: "100%",
        background: "transparent",
        color: readOnly && !isValid ? "error.light" : "text.main",
        offset: 0,
      }}
      editorProps={{ $blockScrolling: true }}
      fontSize="14px"
      mode="json"
      readOnly={readOnly}
      setOptions={{
        tabSize: 2,
        useWorker: false,
        showGutter: false,
        wrap: readOnly && !isValid,
        printMargin: false,
        minLines: showLines,
        maxLines: showLines,
      }}
      theme={theme.jsonTheme}
      value={value}
      onChange={setValue}
      ref={editorRef}
    />
  );
};

export default JsonEditor;
