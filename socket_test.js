import { io } from 'socket.io-client';

/**
 * Socket.io Test Script
 * This script simulates the interaction between different clients:
 * 1. A producer (like Python) adding a call.
 * 2. A consumer (like Dashboard) joining a call.
 * 3. Final cleanup/closing of the call.
 */

const socket = io('http://localhost:3005');

let callCreated = false;

socket.on('connect', () => {
  console.log('✅ Connected to Dispatch Hub');

  // Step 1: Simulate Python adding a new call
  const mockCall = {
    room_id: 'room_' + Math.floor(Math.random() * 1000),
    caller_phone: '+966123456789',
    caller_name: 'Ahmed Khalaf',
    brand_id: 'musaid_app',
    status: 'transfer_requested'
  };

  console.log(`🚀 Adding new call: ${mockCall.room_id}`);
  socket.emit('add_call', mockCall);
});

socket.on('list_of_calls', (calls) => {
  console.log('\n--- Current Active Calls ---');
  console.table(calls);

  const myCall = calls.find(c => c.caller_name === 'Ahmed Khalaf');

  if (myCall && !callCreated) {
    callCreated = true;
    console.log(`\n📞 Call found! Status: ${myCall.status}`);

    if (myCall.status === 'transfer_requested') {
      // Step 2: Simulate Dashboard Staff joining the call
      setTimeout(() => {
        console.log('\n👨‍💻 Staff joining call...');
        socket.emit('join_call', { room_id: myCall.room_id, identity: 'Staff_Member_1' }, (response) => {
          if (response.success) {
            console.log('✅ Join Success!');
            console.log('🔑 Token Received:', response.token.substring(0, 20) + '...');
            
            // Step 3: Simulate closing the call after 3 seconds
            setTimeout(() => {
              console.log('\n🏁 Closing call...');
              socket.emit('close_call', myCall.room_id);
            }, 3000);
          } else {
            console.error('❌ Join Failed:', response.message);
          }
        });
      }, 1500);
    }
  } else if (callCreated && !myCall) {
    console.log('\n✨ Call removed from list. Test Finished Successfully!');
    process.exit(0);
  }
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// Timeout to prevent hanging
setTimeout(() => {
  console.error('\n⌛ Test timed out.');
  process.exit(1);
}, 15000);
