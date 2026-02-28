import sodium from "libsodium-wrappers-sumo";
let privateKey = "I'm ironman.";
let masterKey = "-HlIXSwVRSc6wwAgGCXVnnyC9KZUT4SI0LW4JEh8HNA";

async function securePK() {
  await sodium.ready;
  console.log("privateKey: ", privateKey);

  privateKey = sodium.from_string(privateKey);
  masterKey = sodium.from_base64(masterKey);
  const nonce = sodium.randombytes_buf(24);

  const securedPK = sodium.crypto_secretbox_easy(privateKey, nonce, masterKey);
  console.log("securedPK: ", sodium.to_base64(securedPK));

  unSecurePK(securedPK, nonce, masterKey);
}

securePK();

async function unSecurePK(privateKey, nonce, masterKey) {
  await sodium.ready;

  let unSecuredPK = sodium.crypto_secretbox_open_easy(
    privateKey,
    nonce,
    masterKey,
  );
  console.log("privateKey: ", sodium.to_string(unSecuredPK));
}
