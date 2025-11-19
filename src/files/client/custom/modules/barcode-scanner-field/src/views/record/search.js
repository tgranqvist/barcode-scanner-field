import SearchView from 'views/record/search';

class BarcodeSearchView extends SearchView {

    template = 'barcode-scanner-field:record/search';

    setup() {
        super.setup();
        this.addActionHandler('scan', async () => await this.scan());
    }

    async scan() {
        const $searchField = this.$el.find('input[data-name="textFilter"]'); 
        const scanView = await this.createView(
            'scanner',
            'barcode-scanner-field:views/modals/scanner-view'
        );
        scanView.once('scanned', (code) => $searchField.val(code));
        scanView.render();
    }
}
export default BarcodeSearchView;