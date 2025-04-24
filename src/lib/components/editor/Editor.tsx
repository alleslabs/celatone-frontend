import type { EditorProps, Monaco } from "@monaco-editor/react";

import MonacoEditor from "@monaco-editor/react";

import { moveLanguageConfig, moveTokenProvider } from "./moveSyntax";

const loadMoveSyntax = (monaco: Monaco) => {
  monaco.languages.register({ id: "move" });
  monaco.languages.onLanguage("move", () => {
    monaco.languages.setMonarchTokensProvider("move", moveTokenProvider);
    monaco.languages.setLanguageConfiguration("move", moveLanguageConfig);
  });
};

export const Editor = ({ ...props }: EditorProps) => (
  <MonacoEditor
    beforeMount={loadMoveSyntax}
    height={400}
    language="move"
    options={{
      automaticLayout: true,
      readOnly: true,
      scrollBeyondLastLine: false,
    }}
    theme="vs-dark"
    {...props}
  />
);
