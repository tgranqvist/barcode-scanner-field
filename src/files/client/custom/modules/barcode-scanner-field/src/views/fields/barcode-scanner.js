import BaseFieldView from 'views/fields/base';

/**
 * A custom Espo field that supports barcode scanning using device
 * camera or webcam.
 */
class BarcodeScannerFieldView extends BaseFieldView {
    type = 'barcodeScanner';
    editTemplate = 'barcode-scanner-field:fields/edit';
    listTemplate = 'barcode-scanner-field:fields/list';

    validations = ['required'];

    #sound;

    constructor(options) {
        super(options);
    }
    
    setup() {
        super.setup();
        if (['edit', 'detail'].includes(this.mode) && this.params.playSound) {
            this.#sound = new Audio('client/custom/modules/barcode-scanner-field/res/sounds/beep.mp3');
        }
        this.addActionHandler('scan', async () => await this.openScanner());
    }

    async openScanner() {
        /* getParentView is crucial, as creating a view on `this` leads
           to the camera popup to be rerendered on a closed video stream
           whenever the value is set, giving nasty errors.
        */
        const parent = this.getParentView();
        const scannerView = await parent.createView(
            'scanner',
            'barcode-scanner-field:views/modals/scanner-view'
        );
        scannerView.once('scanned', (code) => {
            if (this.params.playSound) {
                this.#sound.play();
            }
            this.model.set(this.name, code);
        });
        scannerView.render();
    }
}

export default BarcodeScannerFieldView;