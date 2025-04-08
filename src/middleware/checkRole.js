const checkRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.rol !== requiredRole) {
        return res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
      }
      next();
    };
  };
  
  module.exports = checkRole;
  