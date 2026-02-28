import mongoose, { Schema } from "mongoose";

const vaultSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    nonce: {
      type: String,
      required: [true, "Nonce is required"],
    },
    publicKey: {
      type: String,
      required: [true, "Public key is required"],
    },
    securedPrivateKey: {
      type: String,
      required: [true, "Secured private key is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "General",
    },
    icon: {
      type: String,
      default: "🔒",
    },
    owner: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

export const Vault = mongoose.model("Vault", vaultSchema);
