define(['zxing'], function (zxing) {
  const { BrowserMultiFormatReader } = zxing;

  class ZXingDetectorAdapter {

    #reader;
    constructor() {
      this.#reader = new BrowserMultiFormatReader();
    }

    async detect(videoElement) {
        try {
            const result = await this.#reader.decodeOnceFromVideoElement(videoElement);
            return [{rawValue: result.getText()}];
        } finally {
            const stream = videoElement.srcObject;
            
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                videoElement.srObject = null;
            }
        }
    }
  }

  return ZXingDetectorAdapter;
});