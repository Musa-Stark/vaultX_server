import sodium from "libsodium-wrappers-sumo";
import { config } from "../config/index.js";
import { AppError } from "../utils/index.js";

export const hash = async (string) => {
  await sodium.ready;

  return sodium.crypto_pwhash_str(
    string,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
  );
};

export const verify = async (plainPassword, storedHash) => {
  await sodium.ready;

  return sodium.crypto_pwhash_str_verify(storedHash, plainPassword);
};

export const seal = async (str) => {
  await sodium.ready;

  const keyPair = sodium.crypto_box_keypair();
  const strBytes = sodium.from_string(str);

  const encrypted = sodium.crypto_box_seal(strBytes, keyPair.publicKey);
  const password = sodium.to_base64(encrypted);

  let masterKey = config.MASTER_KEY;
  masterKey = sodium.from_base64(masterKey);
  let nonce = sodium.randombytes_buf(24);

  const pk = sodium.crypto_secretbox_easy(keyPair.privateKey, nonce, masterKey);

  nonce = sodium.to_base64(nonce);

  const securedPrivateKey = sodium.to_base64(pk);
  const publicKey = sodium.to_base64(keyPair.publicKey);

  return {
    password,
    nonce,
    publicKey,
    securedPrivateKey,
  };
};

export const unSeal = async (password, nonce, publicKey, securedPrivateKey) => {
  if (!password || !nonce || !publicKey || !securedPrivateKey)
    throw new AppError(
      "Password, nonce, public key and secured private key are required",
    );

  await sodium.ready;

  let masterKey = config.MASTER_KEY;
  masterKey = sodium.from_base64(masterKey);
  nonce = sodium.from_base64(nonce);
  securedPrivateKey = sodium.from_base64(securedPrivateKey);
  publicKey = sodium.from_base64(publicKey);
  password = sodium.from_base64(password);

  const privateKey = sodium.crypto_secretbox_open_easy(
    securedPrivateKey,
    nonce,
    masterKey,
  );

  const decrypted = sodium.crypto_box_seal_open(
    password,
    publicKey,
    privateKey,
  );
  return sodium.to_string(decrypted);
};
