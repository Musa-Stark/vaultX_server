import { AppError } from "../../utils/index.js";
import { Vault } from "./password.model.js";
import { seal, unSeal } from "../../utils/sodium.js";

export const getAllPasswordsService = async (userId) => {
  const passwords = await Vault.find({ owner: userId }).select(
    "-createdAt -updatedAt -__v",
  );

  const excluded = ["nonce", "publicKey", "securedPrivateKey"];

  const cleanedPasswords = await Promise.all(
    passwords.map(async (doc) => {
      const item = doc.toObject();
      item.password = await unSeal(
        item.password,
        item.nonce,
        item.publicKey,
        item.securedPrivateKey,
      );
      excluded.forEach((key) => delete item[key]);
      return item;
    }),
  );

  return cleanedPasswords;
};

export const newPasswordService = async (owner, data) => {
  const { service } = data;

  const existingItem = await Vault.findOne({
    owner,
    service,
  });

  if (existingItem) {
    throw new AppError("Password already exists for this service", 409);
  }

  const passwordData = await seal(data.password);
  data = { ...data, ...passwordData };

  let newItem = await Vault.create({
    ...data,
    owner,
  });

  newItem = newItem.toObject();

  newItem.password = await unSeal(
    newItem.password,
    newItem.nonce,
    newItem.publicKey,
    newItem.securedPrivateKey,
  );

  const excluded = [
    "nonce",
    "publicKey",
    "securedPrivateKey",
    "createdAt",
    "updatedAt",
    "__v",
  ];

  excluded.forEach((key) => delete newItem[key]);

  return newItem;
};

export const updatePasswordService = async (owner, data) => {
  if (owner !== data.owner) throw new AppError("Unauthorized", 409);

  const passwordData = await seal(data.password);
  data = { ...data, ...passwordData };

  let updatedItem = await Vault.findByIdAndUpdate(data._id, data, {
    returnDocument: "after",
  }).select("-createdAt -updatedAt -__v");

  if (!updatedItem) throw new AppError("Item not found", 404);

  updatedItem = updatedItem.toObject();

  updatedItem.password = await unSeal(
    updatedItem.password,
    updatedItem.nonce,
    updatedItem.publicKey,
    updatedItem.securedPrivateKey,
  );

  const excluded = ["nonce", "publicKey", "securedPrivateKey"];

  excluded.forEach((key) => delete updatedItem[key]);

  return updatedItem;
};

export const deletePasswordService = async (owner, data) => {
  if (owner !== data.owner) throw new AppError("Unauthorized", 409);
  const deletedItem = await Vault.findByIdAndDelete(data._id);
  if (!deletedItem) throw new AppError("Item not found", 404);
  return deletedItem;
};
