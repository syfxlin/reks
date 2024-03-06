const decoder = new TextDecoder();

export function toUTF8String(input: Uint8Array, start = 0, end = input.length) {
  return decoder.decode(input.slice(start, end));
}

export function toHexString(input: Uint8Array, start = 0, end = input.length) {
  return input.slice(start, end).reduce((memo, i) => memo + (`0${i.toString(16)}`).slice(-2), "");
}

export function readInt16LE(input: Uint8Array, offset = 0) {
  const val = input[offset] + input[offset + 1] * 2 ** 8;
  return val | ((val & (2 ** 15)) * 0x1FFFE);
}

export const readUInt16BE = (input: Uint8Array, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1];

export const readUInt16LE = (input: Uint8Array, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8;

export function readUInt24LE(input: Uint8Array, offset = 0) {
  return input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16;
}

export function readInt32LE(input: Uint8Array, offset = 0) {
  return input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + (input[offset + 3] << 24);
}

export function readUInt32BE(input: Uint8Array, offset = 0) {
  return input[offset] * 2 ** 24 + input[offset + 1] * 2 ** 16 + input[offset + 2] * 2 ** 8 + input[offset + 3];
}

export function readUInt32LE(input: Uint8Array, offset = 0) {
  return input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + input[offset + 3] * 2 ** 24;
}

export function readUInt(input: Uint8Array, bits: 16 | 32, offset: number, isBigEndian: boolean): number {
  offset = offset || 0;
  if (isBigEndian) {
    if (bits === 16) {
      return readUInt16BE(input, offset);
    } else {
      return readUInt32BE(input, offset);
    }
  } else {
    if (bits === 16) {
      return readUInt16LE(input, offset);
    } else {
      return readUInt32LE(input, offset);
    }
  }
}
