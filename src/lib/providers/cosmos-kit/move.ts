import type { GeneratedType } from "@cosmjs/proto-signing";
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
