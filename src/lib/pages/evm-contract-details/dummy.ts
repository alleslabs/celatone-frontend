// TODO: REMOVE

import { JsonFragment } from "ethers";

export const EVM_ABI: Record<string, JsonFragment> = {
  payable: {
    inputs: [],
    name: "fnPayable",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  int8: {
    inputs: [
      {
        internalType: "int8",
        name: "i8",
        type: "int8",
      },
    ],
    name: "fnInt8",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  bytes4: {
    inputs: [
      {
        internalType: "bytes4",
        name: "b4",
        type: "bytes4",
      },
    ],
    name: "fnBytes4",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  bytes: {
    inputs: [
      {
        internalType: "bytes",
        name: "b",
        type: "bytes",
      },
    ],
    name: "fnBytes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  bool: {
    inputs: [
      {
        internalType: "bool",
        name: "b",
        type: "bool",
      },
    ],
    name: "fnBool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  array: {
    inputs: [
      {
        internalType: "uint8[2][][2]",
        name: "u8f20",
        type: "uint8[2][][2]",
      },
    ],
    name: "fnUint8fixed20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  struct: {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "key",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "value",
                type: "bool",
              },
            ],
            internalType: "struct Types.Struct1",
            name: "s1",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "value",
                type: "bool",
              },
              {
                internalType: "uint256",
                name: "key",
                type: "uint256",
              },
            ],
            internalType: "struct Types.Struct2",
            name: "s2",
            type: "tuple",
          },
        ],
        internalType: "struct Types.Struct3",
        name: "s3",
        type: "tuple",
      },
    ],
    name: "fnStruct3",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
};
