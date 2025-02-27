import type { JsonFragment } from "ethers";

export const categorizeAbi = (abi: JsonFragment[]) => {
  const read: JsonFragment[] = [];
  const write: JsonFragment[] = [];

  abi.forEach((item) => {
    if (item.type !== "function") return;

    const stateMutability = item.stateMutability;
    if (stateMutability === "view" || stateMutability === "pure") {
      read.push(item);
    } else {
      write.push(item);
    }
  });

  return { read, write };
};
