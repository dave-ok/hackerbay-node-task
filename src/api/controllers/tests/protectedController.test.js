import { expect } from "chai";
import sharp from "sharp";
import { convertImageToThumbnail } from "../protectedController";

describe("convertToThumbnail function unit test", function () {
  it("should convert image to thumbnail", async function () {
    const mockImage = await sharp({
      create: {
        width: 300,
        height: 200,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer();

    const thumb = await convertImageToThumbnail(mockImage, 100, 100);
    expect(Buffer.isBuffer(thumb.thumbnail)).true;
    expect(thumb.mimeType).to.contain("png");
  });
});
