export default function generateRandomSlug() {
  const randomBytes = new Uint8Array(2);
  crypto.getRandomValues(randomBytes);

  const slugBuffer = new ArrayBuffer(6);

  // Create a view into the byte array
  const view = new DataView(slugBuffer);

  // Fill the first 4 bytes with the current timestamp in seconds
  view.setUint32(0, Math.floor(Date.now() / 1000));

  view.setUint8(4, randomBytes[0]);
  view.setUint8(5, randomBytes[1]);

  // Encode the byte array
  return base64urlEncode(new Uint8Array(slugBuffer));
}

const base64url = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "-",
  "_",
];

function base64urlEncode(data) {
  let result = "",
    i;

  const l = data.length;

  for (i = 2; i < l; i += 3) {
    result += base64url[data[i - 2] >> 2];
    result += base64url[((data[i - 2] & 0x03) << 4) | (data[i - 1] >> 4)];
    result += base64url[((data[i - 1] & 0x0f) << 2) | (data[i] >> 6)];
    result += base64url[data[i] & 0x3f];
  }

  if (i === l + 1) {
    // 1 octet yet to write
    result += base64url[data[i - 2] >> 2];
    result += base64url[(data[i - 2] & 0x03) << 4];
    result += "==";
  }

  if (i === l) {
    // 2 octets yet to write
    result += base64url[data[i - 2] >> 2];
    result += base64url[((data[i - 2] & 0x03) << 4) | (data[i - 1] >> 4)];
    result += base64url[(data[i - 1] & 0x0f) << 2];
    result += "=";
  }

  return result;
}
