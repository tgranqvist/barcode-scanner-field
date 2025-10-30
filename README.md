# Barcode scanner field extension

This is an extension to [Espo CRM][espo], providing a barcode scanner field.

Still a work in progress, but basic functionality is there:

- Barcode scanning works
- Field can be set as required
- Field can be marked as having personal data

## Development

This uses the [Espo extension template][ext-template] to facilitate development. See their docs.
I work on Windows and have added a small Nginx configuration to run the dev environment in.

## Using the field

Using this field requires permission for your Espo site to access the device's camera. Modern browsers
require the site to be hosted over HTTPS (smart anyways), and if you use the [permission policy][permpol]
header, you need to make sure relevant permissions are set. E.g. `camera=(self)`.

## Resources

The project uses the following great stuff made by others.

- [Espo extension template][ext-template]
- [ZXing browser layer][zxing]
- [Store Scanner Beep][beep] by Freesound

Much appreciated, thanks!

[ext-template]: https://github.com/espocrm/ext-template
[espo]: https://espocrm.com
[zxing]: https://github.com/zxing-js/browser
[beep]: https://pixabay.com/sound-effects/store-scanner-beep-90395/
[permpol]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy