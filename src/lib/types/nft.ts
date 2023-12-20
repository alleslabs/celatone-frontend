import type { SnakeToCamelCaseNested } from "./converter";

export interface TraitResponse {
  trait_type?: string;
  display_type?: string;
  value?: string | number;
}

export type Trait = SnakeToCamelCaseNested<TraitResponse>;
