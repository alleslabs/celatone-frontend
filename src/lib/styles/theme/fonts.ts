import type { DeepPartial, Theme } from "@chakra-ui/react";

export const fonts: DeepPartial<Theme["fonts"]> = {
  heading: "Poppins, serif",
  body: "Space Grotesk, sans-serif",
  mono: "PP Neue Montreal Mono Regular",
};

export const fontHrefs: DeepPartial<Theme["fonts"]> = {
  heading:
    "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap",
  body: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
  mono: "/font/main.css",
};
