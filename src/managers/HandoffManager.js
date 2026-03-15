/**
 * HandoffManager
 * Manages the in-memory state of active calls and their statuses.
 * Follows the Singleton pattern for consistent state across the app.
 */
class HandoffManager {
  constructor() {
    this.calls = new Map(); // Key: room_id, Value: callObject
  }

  /**
   * Adds a new call to the list.
   * @param {Object} callData - The call data object.
   * @returns {Object} - The added call object.
   */
  addCall(callData) {
    const { room_id } = callData;
    const call = {
      ...callData,
      status: callData.status || 'transfer_requested',
      created_at: new Date(),
    };
    this.calls.set(room_id, call);
    return call;
  }

  /**
   * Updates the status of an existing call.
   * @param {string} roomId - The ID of the room.
   * @param {string} status - The new status (e.g., 'in_progress').
   * @returns {Object|null} - The updated call object or null if not found.
   */
  updateStatus(roomId, status) {
    const call = this.calls.get(roomId);
    if (call) {
      call.status = status;
      this.calls.set(roomId, call);
      return call;
    }
    return null;
  }

  /**
   * Removes a call from the list.
   * @param {string} roomId - The ID of the room.
   * @returns {boolean} - True if removed, false if not found.
   */
  removeCall(roomId) {
    return this.calls.delete(roomId);
  }

  /**
   * Retrieves all active calls.
   * @returns {Array<Object>} - Array of call objects.
   */
  getAllCalls() {
    return Array.from(this.calls.values());
  }

  /**
   * Finds a call by its room ID.
   * @param {string} roomId - The ID of the room.
   * @returns {Object|null} - The call object or null if not found.
   */
  getCall(roomId) {
    return this.calls.get(roomId) || null;
  }
}

// Export a single instance to maintain state
export default new HandoffManager();
