export type Step = 1 | 2;

export type Mode = "deploy" | "migrate";

export const StepperText: Record<Mode, string[]> = {
  deploy: ["Upload or Select Code ID", "Instantiate Code"],
  migrate: ["Migrate Options", "Migrate Details"],
};
