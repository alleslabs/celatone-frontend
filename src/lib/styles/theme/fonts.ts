import type { DeepPartial, Theme } from "@chakra-ui/react";

export const fonts: DeepPartial<Theme["fonts"]> = {
  body: "Manrope, sans-serif",
  heading: "Pilat Wide, serif",
  mono: "Roboto Mono, monospace",
};

export const fontHrefs: DeepPartial<Theme["fonts"]> = {
  body: "https://fonts.googleapis.com/css2?family=Manrope:wght@300..700&display=swap",
  heading: "https://assets.initia.xyz/fonts/PilatWide.css",
  mono: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300..700&display=swap",
};
