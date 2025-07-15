function checkRole(role) {
    return (req, res, next) => {
      const userRole = req.headers['role']; // 'admin' or 'user'
      if (userRole !== role) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }
  module.exports = { checkRole };