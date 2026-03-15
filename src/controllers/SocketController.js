import handoffManager from '../managers/HandoffManager.js';

/**
 * SocketController
 * Handles incoming Socket.io events and directs them to appropriate services/managers.
 */
class SocketController {
  constructor(io, liveKitService) {
    this.io = io;
    this.liveKitService = liveKitService;
  }

  /**
   * Initializes the socket connections and listeners.
   */
  init() {
    this.io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // 1. Initial full list sync
      socket.emit('list_of_calls', handoffManager.getAllCalls());

      // 2. Add New Call (Triggered from Python/Internal logic)
      socket.on('add_call', (callData) => {
        const newCall = handoffManager.addCall(callData);
        console.log(`New call added: ${newCall.room_id}`);
        this.broadcastCallList();
      });

      // 3. Join Call (Triggered by Dashboard/Staff)
      socket.on('join_call', async (data, callback) => {
        const { room_id, identity } = data;
        const call = handoffManager.getCall(room_id);

        if (!call) {
          return callback({ success: false, message: 'Call not found.' });
        }

        // Validation - ensure call hasn't been picked up by someone else
        if (call.status !== 'transfer_requested') {
          return callback({ 
            success: false, 
            message: 'Call is already in progress or closed.' 
          });
        }

        try {
          // Update status to in_progress
          handoffManager.updateStatus(room_id, 'in_progress');
          this.broadcastCallList();

          // Generate Token
          const token = await this.liveKitService.generateToken(room_id, identity);
          
          callback({ 
            success: true, 
            token: token,
            livekit_url: this.liveKitService.livekitUrl 
          });
        } catch (error) {
          console.error(`Error joining call ${room_id}:`, error);
          callback({ success: false, message: 'Failed to generate access token.' });
        }
      });

      // 4. Close Call
      socket.on('close_call', (roomId) => {
        if (handoffManager.removeCall(roomId)) {
          console.log(`Call closed: ${roomId}`);
          this.broadcastCallList();
        }
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Broadcasts the updated list of calls to all connected clients.
   */
  broadcastCallList() {
    const activeCalls = handoffManager.getAllCalls();
    this.io.emit('list_of_calls', activeCalls);
  }
}

export default SocketController;
