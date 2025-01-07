import type { DeepPartial, Theme } from "@chakra-ui/react";

export const fonts: DeepPartial<Theme["fonts"]> = {
  body: "Space Grotesk, sans-serif",
  heading: "Poppins, serif",
  mono: "PP Neue Montreal Mono Regular",
};

export const fontHrefs: DeepPartial<Theme["fonts"]> = {
  body: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
  heading:
    "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap",
  mono: "/font/main.css",
};
