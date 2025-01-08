/* eslint-disable sonarjs/no-duplicate-string */
import {
  Alert,
  AlertDescription,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { FileWithPath } from "react-dropzone";
import { useController, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

import type { ModuleVerifyForm } from "../types";
import { DropZone } from "lib/components/dropzone";
import { CustomIcon } from "lib/components/icon";
import { UploadFolderCard } from "lib/components/upload/UploadFolderCard";

interface ModuleVerifyUploadFolderProps {
  control: Control<ModuleVerifyForm>;
}

export const ModuleVerifyUploadFolder = ({
  control,
}: ModuleVerifyUploadFolderProps) => {
  const [rootFolderName, setRootFolderName] = useState("");

  const moveFilesController = useController({
    control,
    name: "moveFiles",
  });

  const tomlFileController = useController({
    control,
    name: "tomlFile",
  });

  const [moveFiles, tomlFile] = useWatch({
    control,
    name: ["moveFiles", "tomlFile"],
  });

  const handleSetFiles = (files: FileWithPath[]) => {
    const filePath = files[0].path;
    if (!filePath) return;

    const foundRootFolderName = filePath.startsWith("/")
      ? filePath.split("/")[1]
      : filePath.split("/")[0];
    setRootFolderName(foundRootFolderName);

    const currentMoveFiles: File[] = [];
    let currentTomlFile = tomlFile;

    files.forEach((file) => {
      const ext = file.name.split(".").pop();
      if (
        ext === "move" &&
        file.path &&
        file.path.includes(`${foundRootFolderName}/sources/`)
      ) {
        currentMoveFiles.push(file);
      } else if (ext === "toml") {
        currentTomlFile = file;
      }
    });

    moveFilesController.field.onChange(currentMoveFiles);
    tomlFileController.field.onChange(currentTomlFile);
  };

  const moveFilesIconProps = useMemo(() => {
    if (!rootFolderName)
      return (
        <>
          <CustomIcon name="check-circle-solid" boxSize={4} color="gray.700" />
          <Text variant="body2">{`\u201C.move\u201D files are required`}</Text>
        </>
      );

    if (moveFiles.length)
      return (
        <>
          <CustomIcon
            name="check-circle-solid"
            boxSize={4}
            color="success.main"
          />
          <Text variant="body2">{`Found ${moveFiles.length} \u201C.move\u201D files`}</Text>
        </>
      );

    return (
      <>
        <CustomIcon name="close-circle-solid" boxSize={4} color="error.main" />
        <Text variant="body2">{`\u201C.move\u201D is not found`}</Text>
      </>
    );
  }, [moveFiles, rootFolderName]);

  const tomlFileIconProps = useMemo(() => {
    if (!rootFolderName)
      return (
        <>
          <CustomIcon name="check-circle-solid" boxSize={4} color="gray.700" />
          <Text variant="body2">{`\u201CMove.toml\u201D file are required`}</Text>
        </>
      );

    if (tomlFile)
      return (
        <>
          <CustomIcon
            name="check-circle-solid"
            boxSize={4}
            color="success.main"
          />
          <Text variant="body2">{`Found \u201CMove.toml\u201D file`}</Text>
        </>
      );

    return (
      <>
        <CustomIcon name="close-circle-solid" boxSize={4} color="error.main" />
        <Text variant="body2">{`\u201CMove.toml\u201D is not found`}</Text>
      </>
    );
  }, [rootFolderName, tomlFile]);

  return (
    <Stack gap={4}>
      <Stack gap={2}>
        <Heading as="h6" variant="h6">
          Upload Project Folder
        </Heading>
        <Text variant="body2" color="text.dark">
          Select a folder to upload files in order to verify the modules
        </Text>
      </Stack>
      <Alert alignItems="flex-start" gap={4} variant="primary">
        <CustomIcon name="info-circle" boxSize={4} color="primary.main" />
        <AlertDescription>
          {`If the verification module requires calling functions from other
    modules, please ensure that the corresponding \u201C.move\u201D files are
    uploaded to complete the process.`}
        </AlertDescription>
      </Alert>
      <Stack gap={2}>
        {!rootFolderName ? (
          <DropZone fileType={["move", "toml"]} setFiles={handleSetFiles} />
        ) : (
          <UploadFolderCard
            deleteFile={() => {
              moveFilesController.field.onChange([]);
              tomlFileController.field.onChange(null);
              setRootFolderName("");
            }}
            fileName={rootFolderName}
            status={moveFiles.length > 0 && tomlFile ? undefined : "error"}
          />
        )}
        <Flex alignItems="center" gap={1}>
          {moveFilesIconProps}
        </Flex>
        <Flex alignItems="center" gap={1}>
          {tomlFileIconProps}
        </Flex>
      </Stack>
    </Stack>
  );
};
