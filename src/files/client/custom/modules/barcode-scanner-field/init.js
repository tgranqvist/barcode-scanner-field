define(['zxing'], function(zxing) {
    if (!('BarcodeDetector' in window)) {
        console.debug('🧪Polyfilling barcode detector API');
        
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
    } else {
        console.debug('✔️Native BarcodeDetector API available');
    }
});