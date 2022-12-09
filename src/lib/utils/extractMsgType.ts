export function extractMsgType(typePath: string): string | undefined {
  return typePath.split(".").at(-1);
}
