// From: https://github.com/image-size/image-size/blob/main/lib/types/webp.ts
import type { IImage, ISize } from "./types";
import { readInt16LE, readUInt24LE, toHexString, toUTF8String } from "./utils";

function calculateExtended(input: Uint8Array): ISize {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4),
  };
}

function calculateLossless(input: Uint8Array): ISize {
  return {
    height: 1 + (((input[4] & 0xF) << 10) | (input[3] << 2) | ((input[2] & 0xC0) >> 6)),
    width: 1 + (((input[2] & 0x3F) << 8) | input[1]),
  };
}

function calculateLossy(input: Uint8Array): ISize {
  // `& 0x3fff` returns the last 14 bits
  // TO-DO: include webp scaling in the calculations
  return {
    height: readInt16LE(input, 8) & 0x3FFF,
    width: readInt16LE(input, 6) & 0x3FFF,
  };
}

export const WEBP: IImage = {
  validate(input) {
    const riffHeader = toUTF8String(input, 0, 4) === "RIFF";
    const webpHeader = toUTF8String(input, 8, 12) === "WEBP";
    const vp8Header = toUTF8String(input, 12, 15) === "VP8";
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(input) {
    const chunkHeader = toUTF8String(input, 12, 16);
    input = input.slice(20, 30);

    // Extended webp stream signature
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 0xC0) === 0;
      const validEnd = (extendedHeader & 0x01) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      } else {
        // TODO: breaking change
        throw new TypeError("Invalid WebP");
      }
    }

    // Lossless webp stream signature
    if (chunkHeader === "VP8 " && input[0] !== 0x2F) {
      return calculateLossy(input);
    }

    // Lossy webp stream signature
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }

    throw new TypeError("Invalid WebP");
  },
};
