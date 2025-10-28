import BaseFieldView from 'views/fields/base';
import ZXingDetectorAdapter from 'zxing-adapter';

/**
 * A custom Espo field that supports barcode scanning using device
 * camera or webcam. It uses either the native BarcodeDetector API
 * or as small polyfill using ZXing's zxing-js/browser.
 */
class BarcodeScannerFieldView extends BaseFieldView {
    type = 'barcodeScanner';
    editTemplate = 'barcode-scanner-field:fields/edit';
    listTemplate = 'barcode-scanner-field:fields/list';

    validations = ['required'];

    #sound;

    constructor(options) {
        super(options);
        if (!('BarcodeDetector' in window)) {
            console.log('Polyfilling barcode detector API');
            window['BarcodeDetector'] = ZXingDetectorAdapter;
        }
    }
    
    setup() {
        super.setup();
        if (['edit', 'detail'].includes(this.mode) && this.params.playSound) {
            this.#sound = new Audio('client/custom/modules/barcode-scanner-field/res/sounds/beep.mp3');
        }
        this.addActionHandler('scan', async () => await this.openScanner());
    }

    async openScanner() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"}, 
            audio: false
        });
        const dialog = Espo.Ui.dialog({
            headerText: 'Scan code',
            backdrop: 'true',
            body: '<video id="barcode-video" autoplay muted style="display:block; margin:0 auto; width:100%; max-width:480px; height:auto; max-height: 40vh; background: #000; border-radius:4px;"></video>'
        });

        dialog.show();
        const videoElement = dialog.$el.find('#barcode-video').get(0);
        videoElement.srcObject = stream;

        const barcodes = await (new BarcodeDetector()).detect(videoElement);
        if (!barcodes.length) return;
        if (this.params.playSound) {
            this.#sound.play().catch(() => console.log('Unable to play sound'));
        }
        this.model.set(this.name, barcodes[0].rawValue);
        dialog.close();
        
        dialog.onClose = () => {
            console.log('closing dialog');
            stream.getTracks().forEach(t => t.stop());
            videoElement.srcObject = null;
        };
    }
}

export default BarcodeScannerFieldView;