import { dateToUnix } from './utils';
import { utils, schnorr, getPublicKey } from '@noble/secp256k1';
const { sha256 } = utils;

import { NostrEvent } from './types';

function hexChar(val: number) {
  if (val < 10) return String.fromCharCode(48 + val);
  if (val < 16) return String.fromCharCode(97 + val - 10);
  return '';
}

function hexEncode(buffer: Uint8Array) {
  let str = '';
  for (let i = 0; i < buffer.length; i++) {
    const c = buffer[i];

    if (c) {
      str += hexChar(c >> 4);
      str += hexChar(c & 0xf);
    }
  }
  return str;
}

async function generateEventId(event: NostrEvent) {
  const { content, created_at, kind, tags, pubkey } = event;
  const serialized = [0, pubkey, created_at, kind, tags, content];
  const commit = JSON.stringify(serialized);
  const buffer = new TextEncoder().encode(commit);
  const shaBuffer = await sha256(buffer);
  return hexEncode(shaBuffer);
}

type PartialNostrEvent = Omit<
  NostrEvent,
  'id' | 'pubkey' | 'sig' | 'created_at'
>;

export const generateSignedEvent = async (
  partialEvent: PartialNostrEvent,
  privKey: string
) => {
  const _pubkey = hexEncode(getPublicKey(privKey, true));
  // Remove "02" at beginning of pubkey:
  const pubkey = _pubkey.substring(2);

  const event: NostrEvent = {
    ...partialEvent,
    pubkey,
    created_at: dateToUnix(new Date()),
  };

  const eventId = await generateEventId(event);
  const signedId = await schnorr.sign(eventId, privKey);

  event.id = eventId;
  event.sig = hexEncode(signedId);

  // Return signed event:
  return event;
};
