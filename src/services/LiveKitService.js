import { AccessToken } from 'livekit-server-sdk';

/**
 * LiveKitService
 * Responsible for interacting with the LiveKit Server SDK.
 */
class LiveKitService {
  constructor(apiKey, apiSecret, livekitUrl) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.livekitUrl = livekitUrl;
  }

  /**
   * Generates an Access Token for a participant to join a room.
   * @param {string} roomName - The name of the LiveKit room.
   * @param {string} participantIdentity - Unique identity for the participant.
   * @returns {Promise<string>} - The generated JWT token.
   */
  async generateToken(roomName, participantIdentity) {
    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: participantIdentity,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    return await at.toJwt();
  }
}

export default LiveKitService;
