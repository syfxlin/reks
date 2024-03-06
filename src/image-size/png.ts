// From: https://github.com/image-size/image-size/blob/main/lib/types/png.ts
import type { IImage } from "./types";
import { readUInt32BE, toUTF8String } from "./utils";

const pngSignature = "PNG\r\n\x1A\n";
const pngImageHeaderChunkName = "IHDR";

// Used to detect "fried" png's: http://www.jongware.com/pngdefry.html
const pngFriedChunkName = "CgBI";

export const PNG: IImage = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32),
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16),
    };
  },
};
