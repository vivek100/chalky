import { LocalAudioTrack, Room, RoomEvent } from "livekit-client";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_UNSAFE_LIVEKIT_URL || "";
const LIVEKIT_API_KEY = process.env.NEXT_PUBLIC_UNSAFE_LIVEKIT_API_KEY || "";
const LIVEKIT_API_SECRET = process.env.NEXT_PUBLIC_UNSAFE_LIVEKIT_API_SECRET || "";

function base64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const binary = String.fromCharCode(...view);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function textToBase64Url(text: string) {
  return base64Url(new TextEncoder().encode(text));
}

async function signHmacSha256(message: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64Url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

async function createUnsafeLiveKitToken(roomName: string, identity: string) {
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new Error("Missing unsafe LiveKit API key/secret env values.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const payload = {
    iss: LIVEKIT_API_KEY,
    sub: identity,
    iat: now,
    exp: now + 60 * 60,
    nbf: now - 10,
    video: {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    }
  };

  const unsigned = `${textToBase64Url(JSON.stringify(header))}.${textToBase64Url(JSON.stringify(payload))}`;
  return `${unsigned}.${await signHmacSha256(unsigned, LIVEKIT_API_SECRET)}`;
}

export type BrowserLiveKitSession = {
  roomName: string;
  identity: string;
  connected: boolean;
  publishMicrophoneTrack: (track: MediaStreamTrack) => Promise<void>;
  disconnect: () => void;
};

export async function connectBrowserLiveKit(roomName: string, identity: string, onStatus?: (status: string) => void): Promise<BrowserLiveKitSession> {
  if (!LIVEKIT_URL) {
    throw new Error("Missing unsafe LiveKit URL env value.");
  }

  const token = await createUnsafeLiveKitToken(roomName, identity);
  const room = new Room();

  room.on(RoomEvent.Disconnected, () => onStatus?.("disconnected"));
  room.on(RoomEvent.Connected, () => onStatus?.("connected"));

  await room.connect(LIVEKIT_URL, token);
  onStatus?.("connected");

  let publishedTrack: LocalAudioTrack | null = null;

  return {
    roomName,
    identity,
    connected: true,
    publishMicrophoneTrack: async (track) => {
      if (publishedTrack) {
        await room.localParticipant.unpublishTrack(publishedTrack);
        publishedTrack.stop();
      }
      publishedTrack = new LocalAudioTrack(track);
      await room.localParticipant.publishTrack(publishedTrack, { name: "browser-agent-mic" });
    },
    disconnect: () => {
      if (publishedTrack) {
        void room.localParticipant.unpublishTrack(publishedTrack);
        publishedTrack.stop();
      }
      room.disconnect();
    }
  };
}
