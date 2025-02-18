export function input_2_hex(input: string) {
  if (input.startsWith('0x')) {
    return input;
  }

  return `0x${input}`;
}
