import type { GeneratedType } from "@cosmjs/proto-signing";
import type { AminoConverters } from "@cosmjs/stargate";

import {
  MsgExecute as MsgExecuteClass,
  MsgPublish as MsgPublishClass,
  MsgScript as MsgScriptClass,
} from "@initia/initia.js";
import {
  MsgExecute,
  MsgPublish,
  MsgScript,
} from "@initia/initia.proto/initia/move/v1/tx";

export const moveTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/initia.move.v1.MsgExecute", MsgExecute],
  ["/initia.move.v1.MsgPublish", MsgPublish],
  ["/initia.move.v1.MsgScript", MsgScript],
];

export const createMoveAminoConverters = (): AminoConverters => {
  return {
    "/initia.move.v1.MsgExecute": {
      aminoType: "move/MsgExecute",
      fromAmino: (data: MsgExecuteClass.Amino["value"]) =>
        MsgExecuteClass.fromAmino({
          type: "move/MsgExecute",
          value: data,
        }).toProto(),
      toAmino: (data: MsgExecuteClass.Proto) =>
        MsgExecuteClass.fromProto(data).toAmino().value,
    },
    "/initia.move.v1.MsgPublish": {
      aminoType: "move/MsgPublish",
      fromAmino: (data: MsgPublishClass.Amino["value"]) =>
        MsgPublishClass.fromAmino({
          type: "move/MsgPublish",
          value: data,
        }).toProto(),
      toAmino: (data: MsgPublishClass.Proto) =>
        MsgPublishClass.fromProto(data).toAmino().value,
    },
    "/initia.move.v1.MsgScript": {
      aminoType: "move/MsgScript",
      fromAmino: (data: MsgScriptClass.Amino["value"]) =>
        MsgScriptClass.fromAmino({
          type: "move/MsgScript",
          value: data,
        }).toProto(),
      toAmino: (data: MsgScriptClass.Proto) =>
        MsgScriptClass.fromProto(data).toAmino().value,
    },
  };
};
