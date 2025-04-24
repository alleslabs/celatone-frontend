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

export const formatMoveOptions = <T extends number | string>(values: T[]) =>
  values.map((value) => ({
    label: String(value),
    value,
  }));
