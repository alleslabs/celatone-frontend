import { Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import type { MoveVerifyTaskInfo } from "../../data";

interface FileNamesCellProps {
  task: MoveVerifyTaskInfo;
}

export const FileNamesCell = ({ task }: FileNamesCellProps) => {
  const [isHoverText, setIsHoverText] = useState(false);

  const formattedText = useMemo(() => {
    const files = Object.keys(task.fileMap)
      .filter((file) => !file.includes(".toml"))
      .map((file) => file.slice(0, -5)); // remove ".move" extension

    if (isHoverText) return files.join(", ");

    const firstPart = files.slice(0, 3).join(", ");
    const remaining = files.length - 3;

    // eslint-disable-next-line sonarjs/no-nested-template-literals
    return `${firstPart}${remaining > 0 ? `, +${remaining}` : ""}`;
  }, [isHoverText, task.fileMap]);

  return (
    <Flex
      flexWrap="wrap"
      bgColor={isHoverText ? "gray.800" : "undefined"}
      borderRadius="8px"
      onMouseOut={() => setIsHoverText(false)}
      onMouseOver={() => setIsHoverText(true)}
      wordBreak="break-word"
    >
      <Text>{formattedText}</Text>
    </Flex>
  );
};
