import { structToString } from "./utils";

const indent = " ".repeat(4);

export const metadata = {
  header: ["Example", "Published module", "Able to do", "Unable to do"],
  fields: [
    [
      structToString({
        a: "u64",
        b: "bool,",
      }),
    ],
    [
      structToString({
        a: "u64, // remove old field",
      }),
      structToString({
        a: "u64",
        b: "bool, // remain the same",
      }),
    ],
    [
      structToString({
        a: "u64",
        b: "<span style='font-weight: 700;'>u64</span>, // cannot change type",
      }),
      structToString({
        a: "u64",
        b: "bool",
        c: "<span style='font-weight: 700;'>bool</span>, // cannot add new field",
      }),
    ],
  ],
  visibility: [
    ["’public’ or ’script’", "’friend’", "’private’"],
    [
      "same as current value",
      "Can be changed to ‘public’ or maintain as ‘friend’",
      "Can be changed to any value",
    ],
    ["change to new value", "Change to script", "-"],
  ],
  is_entry: [
    ["’true’", "’false’"],
    ["must remain ’true’", "Can be changed to ’true’ or maintain as ’false’"],
    ["Change to ’false’", "Can be changed to ’true’ or maintain as ’false’"],
  ],
  parameter: ["Ensure the old parameters remain unchanged"],
  generic_type_params: [
    [
      "Abilities can be retained or removed, but adding new ones is not allowed. Example below.",
    ],
    ["Example", "Can be", "Cannot be"],
    [
      [
        `public fun example_function&lt;T0: store + drop, T1: store&gt;(...): ... { \n${indent}... \n }`,
      ],
      [
        `public fun example_function&lt;T0: store + drop, T1: store&gt;(...): ... { \n${indent}... <span style='color: #B7B7B7;'>// can remain same</span> \n}`,
        `public fun example_function&lt;T0, T1: store&gt;(...): ... {\n${indent}... <span style='color: #B7B7B7;'>// ability can be removed</span>\n}`,
      ],
      [
        `public fun example_function&lt;T0: store + drop + copy, T1: store&gt;(...): ... {\n${indent}... <span style='color: #B7B7B7;'>// cannot add new ability</span>\n}`,
        `public fun example_function&lt;T0: store + drop&gt;(...): ... {\n${indent}... <span style='color: #B7B7B7;'>// T1 cannot be removed</span>\n}`,
      ],
    ],
  ],
};
