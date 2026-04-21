const clients = new Map();

exports.subscribe = (req, res) => {
  const { deviceId } = req.params;
  const userId = req.user.id; // From auth middleware

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Store the connection
  if (!clients.has(userId)) {
    clients.set(userId, new Map());
  }
  clients.get(userId).set(deviceId, res);

  req.on('close', () => {
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.delete(deviceId);
      if (userClients.size === 0) {
        clients.delete(userId);
      }
    }
  });

  // Keep alive
  const intervalId = setInterval(() => {
    res.write(':\n\n');
  }, 30000);

  req.on('close', () => clearInterval(intervalId));
};

exports.emitToUser = (userId, type, payload) => {
  const userClients = clients.get(userId);
  if (userClients) {
    const data = `data: ${JSON.stringify({ type, ...payload })}\n\n`;
    userClients.forEach(res => {
      res.write(data);
    });
  }
};
