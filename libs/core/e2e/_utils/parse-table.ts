import { type Page, test } from '@playwright/test';

type ParsedValue<T extends string> = {
  [K in T]: string | number;
};

function parseValue(value: string): string | number | boolean {
  const trimmed = value.trim();

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  // Check if it's a valid number (including negative and decimals)
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  return trimmed;
}

const parseTable = <T extends string>(
  strings: TemplateStringsArray,
  values: unknown[],
): Record<T, any>[] => {
  // Reconstruct the full string with interpolated values
  let fullString = strings[0];
  for (let i = 0; i < values.length; i++) {
    fullString += String(values[i]) + strings[i + 1];
  }

  const lines = fullString
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const headers = lines[0].split('|').map((h) => h.trim()) as T[];

  return lines.slice(1).map((line) => {
    const values = line.split('|').map((v) => parseValue(v));
    return Object.fromEntries(
      headers.map((h, i) => [h, values[i]]),
    ) as ParsedValue<T>;
  });
};

export const tableTest = <T extends string>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => {
  const parsedTable = parseTable<T>(strings, values);

  return (
    namePattern: string,
    testFn: (fixtures: { page: Page }, row: Record<T, any>) => Promise<void>,
  ) => {
    for (const row of parsedTable) {
      // Replace $key with actual values in test name
      const testName = namePattern.replace(
        /\$(\w+)/g,
        (_, key) => row[key as T] ?? `$${key}`,
      );

      test(testName, async ({ page }) => {
        await testFn({ page }, row);
      });
    }
  };
};

export const tableTestDescribe = <T extends string>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => {
  const parsedTable = parseTable<T>(strings, values);

  return (namePattern: string, testFn: (row: Record<T, any>) => void) => {
    for (const row of parsedTable) {
      // Replace $key with actual values in test name
      const testName = namePattern.replace(
        /\$(\w+)/g,
        (_, key) => row[key as T] ?? `$${key}`,
      );

      test.describe(testName, async () => {
        await testFn(row);
      });
    }
  };
};
