/**
 * Phantom signs an exact legacy Transaction built by /api/pay/asset-build.
 * Separate from Saul ACOPAY sponsor/cosign (DOCS/74).
 */
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  broadcastPayAsset,
  buildPayAsset,
  type PayAssetPreview,
  type PayTransferAsset,
} from "./payWebSession";
import { getPhantomProvider } from "./phantomPay";

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return btoa(s);
}

export async function sendAssetWithPhantom(input: {
  to: string;
  amount: string;
  asset: PayTransferAsset;
}): Promise<{ signature: string; explorer: string; preview: PayAssetPreview }> {
  const provider = getPhantomProvider();
  if (!provider?.signTransaction) throw new Error("PHANTOM_MISSING");

  const built = await buildPayAsset(input);
  const expected = new PublicKey(built.from);
  const connected = await provider.connect();
  const owner = connected.publicKey ?? provider.publicKey;
  if (!owner || !owner.equals(expected)) throw new Error("WRONG_WALLET");

  const tx = Transaction.from(b64ToBytes(built.transaction));
  const signed = await provider.signTransaction(tx);
  const broadcast = await broadcastPayAsset({
    transaction: bytesToB64(
      signed.serialize({ requireAllSignatures: false, verifySignatures: false }),
    ),
    pendingId: built.pendingId,
    pendingSecret: built.pendingSecret,
  });

  return {
    signature: broadcast.signature,
    explorer: broadcast.explorer,
    preview: built,
  };
}
