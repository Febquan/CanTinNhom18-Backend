let adminSocketIds = [];

module.exports = {
  init: (socketId) => {
    adminSocketIds.push(socketId);
  },
  getAdminSocketIds: () => {
    if (!adminSocketIds) {
      throw new Error("adminSocketId not initialized!");
    }
    return adminSocketIds;
  },
};
