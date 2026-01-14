const args = new URLSearchParams(window.location.search)
const jstr = new TextDecoder().decode( Uint8Array.fromBase64(args.get('v')) )
const obj = JSON.parse(jstr)

// take the thingbert that came in through the GET
for(k of Object.keys(obj))
{
    const ele = document.getElementById(k);
    ele.textContent = obj[k];
}

// Generate QR code
const QRC = qrcodegen.QrCode;

// Returns a string of SVG code for an image depicting the given QR Code, with the given number
// of border modules. The string always uses Unix newlines (\n), regardless of the platform.
function toSvgString(qr, border, lightColor, darkColor) {
    if (border < 0)
    {
        throw new RangeError("Border must be non-negative");
    }

    let parts = [];

    for (let y = 0; y < qr.size; y++)
    {
        for (let x = 0; x < qr.size; x++)
        {
            if (qr.getModule(x, y))
            {
                parts.push(`M${x + border},${y + border}h1v1h-1z`);
            }
        }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
    viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}"
    width = "200"
    height= "200"
    stroke="none">
    <rect width="100%" height="100%" fill="${lightColor}"/>
    <path d="${parts.join(" ")}" fill="${darkColor}"/>
</svg>
`;
}

const qr0 = QRC.encodeText(obj.ticket, QRC.Ecc.LOW);
const svg = toSvgString(qr0, 2, 'white', 'black');

document.getElementById('inject').innerHTML = svg;
