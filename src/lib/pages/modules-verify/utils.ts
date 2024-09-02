export const generateFileMap = (tomlFile: File, moveFiles: File[]) => {
  const initializedFileMap: {
    [key: string]: string;
  } = {};

  if (tomlFile) {
    initializedFileMap[tomlFile.name] = tomlFile.name;
  }

  if (moveFiles.length) {
    moveFiles.forEach((file) => {
      initializedFileMap[file.name] = `sources/${file.name}`;
    });
  }

  return JSON.stringify(initializedFileMap);
};
