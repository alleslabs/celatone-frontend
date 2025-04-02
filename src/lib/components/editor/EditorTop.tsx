import type { Nullable } from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Fragment } from "react";

import type { SourceTreeNode } from "./types";

import { CustomIcon } from "../icon";
import { EditorFileBody } from "./EditorFileBody";

interface EditorTopProps {
  filesList: SourceTreeNode[];
  selectedFile: Nullable<SourceTreeNode>;
  initialFilePath: string;
  onClick: (index: number) => void;
  onRemove: (node: SourceTreeNode, index: number) => void;
}

const vsCodeDarkColor = "#1E1E1E";

export const EditorTop = ({
  filesList,
  selectedFile,
  initialFilePath,
  onClick,
  onRemove,
}: EditorTopProps) => (
  <Box bgColor={vsCodeDarkColor} height="72px" position="relative">
    <Flex
      bgColor="gray.900"
      left={0}
      overflow="auto"
      position="absolute"
      right={0}
      top={0}
      zIndex={1}
    >
      {filesList.map((node, index) => {
        const isInitialFilePath = initialFilePath === node.path;
        const isSelected = selectedFile?.path === node.path;

        return (
          <Flex
            key={`${node.path}-editor-top`}
            alignItems="center"
            cursor="pointer"
            gap={0.5}
            pr={isInitialFilePath ? 2 : 0.5}
            px={0.5}
            py={1}
            sx={{
              borderWidth: "1px",
              borderTopColor: isSelected ? "primary.main" : vsCodeDarkColor,
              borderLeftColor: "transparent",
              borderRightColor: "gray.700",
              borderBottomColor: isSelected ? vsCodeDarkColor : "gray.700",
              bgColor: isSelected ? vsCodeDarkColor : "gray.900",
              "&:first-of-type": {
                borderLeftColor: vsCodeDarkColor,
              },
            }}
            onClick={() => onClick(index)}
          >
            <EditorFileBody
              initialFilePath={initialFilePath}
              isNoWrap
              node={node}
            />
            {!isInitialFilePath && (
              <CustomIcon
                boxSize={3}
                color="gray.600"
                cursor="pointer"
                name="close"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(node, index);
                }}
              />
            )}
          </Flex>
        );
      })}
    </Flex>
    {selectedFile && (
      <Box pt="31px">
        <Flex
          bgColor={vsCodeDarkColor}
          borderColor="gray.700"
          borderStyle="solid"
          borderTopWidth="1px"
          pb={1}
          pt={4}
          px={2}
        >
          {selectedFile.path.split("/").map((path, index) => (
            <Fragment key={`${path}-${index}`}>
              {index !== 0 && (
                <CustomIcon boxSize={3} color="gray.600" name="chevron-right" />
              )}
              <Text color="gray.600" variant="body3">
                {path}
              </Text>
            </Fragment>
          ))}
        </Flex>
      </Box>
    )}
  </Box>
);
