
module.exports = function(socket) {

  socket.on('disconnect', function(e) {
    console.info(e);
  });

  socket.on('drawing', function(obj) {
    socket.emit('drawing', obj);
    socket.broadcast.emit('drawing', obj);
  });

  socket.on('clearAll', function(obj) {
    socket.emit('clearAll', obj);
    socket.broadcast.emit('clearAll', obj);
  });

};
