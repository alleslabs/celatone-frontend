import type { DeepPartial, Theme } from "@chakra-ui/react";

export const fonts: DeepPartial<Theme["fonts"]> = {
  heading: "Pilat Wide, serif",
  body: "Manrope, sans-serif",
  mono: "Roboto Mono, monospace",
};

export const fontHrefs: DeepPartial<Theme["fonts"]> = {
  heading: "https://assets.initia.xyz/fonts/PilatWide.css",
  body: "https://fonts.googleapis.com/css2?family=Manrope:wght@300..700&display=swap",
  mono: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300..700&display=swap",
};
