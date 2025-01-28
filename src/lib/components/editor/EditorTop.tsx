import { Box, Flex, Text } from "@chakra-ui/react";
import { SourceTreeNode } from "./types";
import { EditorFileBody } from "./EditorFileBody";
import { CustomIcon } from "../icon";
import { Nullable } from "lib/types";
import { Fragment } from "react";

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
  <Box position="relative" height="72px" bgColor={vsCodeDarkColor}>
    <Flex
      position="absolute"
      bgColor="gray.900"
      top={0}
      left={0}
      right={0}
      zIndex={1}
      overflow="auto"
    >
      {filesList.map((node, index) => {
        const isInitialFilePath = initialFilePath === node.path;
        const isSelected = selectedFile?.path === node.path;

        return (
          <Flex
            py={1}
            px={0.5}
            pr={isInitialFilePath ? 2 : 0.5}
            key={`${node.path}-editor-top`}
            gap={0.5}
            cursor="pointer"
            alignItems="center"
            onClick={() => onClick(index)}
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
          >
            <EditorFileBody
              isNoWrap
              node={node}
              initialFilePath={initialFilePath}
            />
            {!isInitialFilePath && (
              <CustomIcon
                name="close"
                boxSize={3}
                color="gray.600"
                cursor="pointer"
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
          px={2}
          pb={1}
          pt={4}
          borderTop="1px"
          borderTopColor="gray.700"
        >
          {selectedFile.path.split("/").map((path, index) => (
            <Fragment key={`${path}-${index}`}>
              {index !== 0 && (
                <CustomIcon name="chevron-right" boxSize={3} color="gray.600" />
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
