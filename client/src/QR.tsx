import QRCode from 'qrcode.react';

export default function QR() {
    let currentUrl = window.location.protocol + '//' + window.location.host + '/';

    return (
        <div className="qr">
            <QRCode value={currentUrl} size={300} />
        </div>
    );
}
