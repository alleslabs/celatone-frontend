/* eslint-disable no-useless-escape */
import type { languages } from "monaco-editor";

export const moveLanguageConfig: languages.LanguageConfiguration = {
  autoClosingPairs: [
    { close: "]", open: "[" },
    { close: "}", open: "{" },
    { close: ")", open: "(" },
    { close: '"', notIn: ["string"], open: '"' },
  ],
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  comments: {
    blockComment: ["/*", "*/"],
    lineComment: "//",
  },
  folding: {
    markers: {
      end: /^\s*#pragma\s+endregion\b/,
      start: /^\s*#pragma\s+region\b/,
    },
  },
  surroundingPairs: [
    { close: "}", open: "{" },
    { close: "]", open: "[" },
    { close: ")", open: "(" },
    { close: '"', open: '"' },
    { close: "'", open: "'" },
  ],
};
export const moveTokenProvider: languages.IMonarchLanguage = {
  controlFlowKeywords: [
    "continue",
    "else",
    "for",
    "if",
    "while",
    "loop",
    "match",
  ],

  // C# style strings
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',
  keywords: [
    "as",
    "break",
    "const",
    "crate",
    "enum",
    "extern",
    "false",
    "fun",
    "script",
    "in",
    "let",
    "module",
    "move",
    "mut",
    "pub",
    "ref",
    "return",
    "self",
    "Self",
    "static",
    "struct",
    "super",
    "trait",
    "true",
    "type",
    "unsafe",
    "use",
    "where",
    "use",
    "macro_rules",
  ],

  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "&",
    "|",
    "^",
    "%",
    "<<",
    ">>",
    ">>>",
    "+=",
    "-=",
    "*=",
    "/=",
    "&=",
    "|=",
    "^=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // The main tokenizer for languages
  tokenizer: {
    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"], // nested comment
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],

    func_decl: [[/[a-z_$][\w$]*/, "support.function", "@pop"]],

    root: [
      // identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@controlFlowKeywords": "keyword.control",
            "@default": "variable",
            "@keywords": {
              cases: {
                "@default": "keyword",
                fun: { next: "@func_decl", token: "keyword" },
                if: { next: "@func_decl", token: "keyword" },
                let: { next: "@func_decl", token: "keyword" },
                use: { next: "@func_decl", token: "keyword" },
              },
            },
            "@typeKeywords": "type.identifier",
          },
        },
      ],
      [/[A-Z][\w\$]*/, "type.identifier"], // to show class names nicely

      // whitespace
      { include: "@whitespace" },

      // delimiters and operators
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/@symbols/, { cases: { "@default": "", "@operators": "operator" } }],

      // @ annotations.
      // As an example, we emit a debugging log message on these tokens.
      // Note: message are supressed during the first load -- change some lines to see them.
      [
        /@\s*[a-zA-Z_\$][\w\$]*/,
        { log: "annotation token: $0", token: "annotation" },
      ],

      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/"/, { bracket: "@open", next: "@string", token: "string.quote" }],

      // characters
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { bracket: "@close", next: "@pop", token: "string.quote" }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],
  },

  typeKeywords: [
    "Self",
    "m32",
    "m64",
    "m128",
    "f80",
    "f16",
    "f128",
    "int",
    "uint",
    "float",
    "char",
    "bool",
    "u8",
    "u16",
    "u32",
    "u64",
    "f32",
    "f64",
    "i8",
    "i16",
    "i32",
    "i64",
    "str",
    "Option",
    "Either",
    "c_float",
    "c_double",
    "c_void",
    "FILE",
    "fpos_t",
    "DIR",
    "dirent",
    "c_char",
    "c_schar",
    "c_uchar",
    "c_short",
    "c_ushort",
    "c_int",
    "c_uint",
    "c_long",
    "c_ulong",
    "size_t",
    "ptrdiff_t",
    "clock_t",
    "time_t",
    "c_longlong",
    "c_ulonglong",
    "intptr_t",
    "uintptr_t",
    "off_t",
    "dev_t",
    "ino_t",
    "pid_t",
    "mode_t",
    "ssize_t",
  ],
};
