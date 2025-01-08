import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { useCallback, useMemo } from "react";

export interface RestrictedInputReturn {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
}

export interface RestrictedNumberInputParams {
  maxDecimalPoints?: number;
  maxIntegerPoints?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: "decimal" | "integer";
}

/**
 * @param availableCharacters 'abc', 'a-z', 'a-z0-9'
 */
export function useRestrictedInput(
  availableCharacters: ((character: string) => boolean) | string
): RestrictedInputReturn {
  const test: (character: string) => boolean = useMemo(() => {
    if (typeof availableCharacters === "string") {
      const pattern = new RegExp(`[${availableCharacters}]`);
      return (character: string) => pattern.test(character);
    }

    if (typeof availableCharacters === "function") {
      return availableCharacters;
    }

    throw new Error("availableCharacters must be string or function");
  }, [availableCharacters]);

  const onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void =
    useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (!test(event.key)) {
          // prevent key press
          event.preventDefault();
          event.stopPropagation();
        }
      },
      [test]
    );

  return {
    onKeyPress,
  };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function useRestrictedNumberInput({
  maxDecimalPoints = 6,
  maxIntegerPoints = 7,
  onChange: _onChange,
  type = "decimal",
}: RestrictedNumberInputParams): RestrictedInputReturn {
  const { onKeyPress: restrictCharacters } = useRestrictedInput(
    type === "integer" ? "0-9" : "0-9."
  );

  const isInvalid = useCallback(
    (nextValue: string): boolean => {
      return (
        Number.isNaN(+nextValue) ||
        (typeof maxIntegerPoints === "number" &&
          new RegExp(`^[0-9]{${maxIntegerPoints + 1},}`).test(nextValue)) ||
        (type === "decimal" &&
          typeof maxDecimalPoints === "number" &&
          new RegExp(`\\.[0-9]{${maxDecimalPoints + 1},}$`).test(nextValue))
      );
    },
    [maxDecimalPoints, maxIntegerPoints, type]
  );

  const onKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      restrictCharacters(event);

      if (event.isDefaultPrevented()) {
        return;
      }

      const { selectionEnd, selectionStart, value } =
        event.target as HTMLInputElement;

      if (
        typeof selectionStart !== "number" ||
        typeof selectionEnd !== "number"
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const char = event.key;

      const nextValue =
        value.substring(0, selectionStart) +
        char +
        value.substring(selectionEnd);

      if (isInvalid(nextValue)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [restrictCharacters, isInvalid]
  );

  const onPaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      const pastedText = event.clipboardData?.getData("text");

      if (!/^[0-9.]+$/.test(pastedText)) {
        event.preventDefault();
        event.stopPropagation();
      }

      const { selectionEnd, selectionStart, value } =
        event.target as HTMLInputElement;

      if (
        typeof selectionStart !== "number" ||
        typeof selectionEnd !== "number"
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const nextValue =
        value.substring(0, selectionStart) +
        pastedText +
        value.substring(selectionEnd);

      if (isInvalid(nextValue)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [isInvalid]
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (_onChange) {
        const hasNonNumeralCharacters = /[^0-9.]/g;

        if (hasNonNumeralCharacters.test(event.target.value)) {
          // eslint-disable-next-line no-param-reassign
          event.target.value = event.target.value.replace(/[^0-9.]/g, "");
        }

        _onChange(event);
      }
    },
    [_onChange]
  );

  return { onChange, onKeyPress, onPaste };
}
