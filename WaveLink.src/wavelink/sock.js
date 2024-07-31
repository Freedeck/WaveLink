module.exports = (socket, io, instance) => {
  socket.on('wl.stat', async (wanted) => {
    let type = wanted.split('@')[1];
    wanted = wanted.split('@')[0];
    const inp = await instance.wlc.getInput({name:wanted});
    let returning = type == 'm' ? inp.localMute : inp.streamMute;
    io.emit('wl.stat', JSON.stringify({input: wanted, value:returning, type}));
  })
  socket.on('wl.vol', async (wanted) => {
    let type = wanted.split('@')[1];
    wanted = wanted.split('@')[0];
    const inp = await instance.wlc.getInput({name:wanted});
    let returning = type == 'v' ? inp.localVolume : inp.streamVolume;
    io.emit('wl.vol', JSON.stringify({input: wanted, value:returning, type}));
  });
}