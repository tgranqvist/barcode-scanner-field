define(['zxing'], function(zxing) {
    console.debug('Installing barcode detector adapter');
    
    const { BrowserMultiFormatReader } = zxing;

    class ZXingDetectorAdapter {
        constructor() {
            this.reader = new BrowserMultiFormatReader();
        }

        async detect(videoElement) {
            try {
                const result = await this.reader.decodeOnceFromVideoElement(videoElement);
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

    window['BarcodeDetector'] = ZXingDetectorAdapter;
});