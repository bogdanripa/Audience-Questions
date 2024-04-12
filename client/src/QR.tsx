import QRCode from 'qrcode.react';

export default function QR() {
const currentUrl = window.location.href.replace(/\/qr.*$/, '');

    return (
        <div className="qr">
            <QRCode value={currentUrl} size={300} />
        </div>
    );
}