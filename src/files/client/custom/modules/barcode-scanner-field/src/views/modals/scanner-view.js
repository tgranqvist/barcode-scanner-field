import ModalView from 'views/modal';

/**
 * A barcode scanner modal popup.
 * 
 * The popup shows a live video feed and attaches a barcode detector
 * to the stream. The environment-facing camera is preferred.
 * 
 * You can use this as so:
 * <code>
 *   const view = createView(
 *     'scanner',
 *     'barcode-scanner-field:views/modals/scanner-view'
 *   );
 *    
 *   view.once('scanned', (code) => console.log(code));
 *   view.render();
 * </code>
 */
class ScannerModalView extends ModalView {
    template = 'barcode-scanner-field:modals/scan';

    #video;
    #stream;

    async afterRender() {
        this.#video = this.$el.find('video').get(0);
        this.#stream = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"}, 
            audio: false
        });

        this.#video.srcObject = this.#stream;

        const results = await (new BarcodeDetector()).detect(this.#video);
        if (results.length) {
            this.trigger('scanned', results[0].rawValue);
            this.close();
        }
    }

    close() {
        super.close();
        if (this.#stream) {
            this.#stream.getTracks().forEach(t => t.stop())
        }

        if (this.#video) {
            this.#video.srcObject = null;
        }
    }
};

export default ScannerModalView;