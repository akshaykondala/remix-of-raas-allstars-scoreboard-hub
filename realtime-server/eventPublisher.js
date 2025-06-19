const { getIO } = require('./socketManager');

// emit score update
function publishScoreUpdate(teamId, newScore) {
    const io = getIO();
    if (!io) {
        console.error('Socket.io not initialized');
        return;
    }

    io.emit('scoreUpdate', {
        teamId,
        newScore,
        timestamp: Date.now()
    });
}

// emit projection update
function publishProjectionUpdate(teamId, newProjection) {
    const io = getIO();
    if (!io) {
      console.error('Socket.io not initialized yet!');
      return;
    }
  
    io.emit('projectionUpdate', {
      teamId,
      newProjection,
      timestamp: Date.now()
    });
  }
  
  module.exports = {
    publishScoreUpdate,
    publishProjectionUpdate
  };
