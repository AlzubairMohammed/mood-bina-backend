const jwt = require("jsonwebtoken");
const { Users } = require("../models");

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) return res.status(401).json({ message: "not authorized" });
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.user.id);
    req.user = await Users.findOne({ where: { id: decoded.user.id } });
    next();
  } catch (err) {
    return res.status(401).json({ message: "not authorized" });
  }
};

// Grant access for specific roles

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `user role ${req.user.role} is not authorzied` });
    }
    next();
  };
};

// Grant access for create route
exports.authorizeCreate = () => {
  return async (req, res, next) => {
    if (!req.user.c) {
      return res
        .status(403)
        .json({ message: `user role ${req.user.role} is not allow to create` });
    }
    next();
  };
};

// Grant access for update route
exports.authorizeUpdate = () => {
  return async (req, res, next) => {
    if (!req.user.u) {
      return res
        .status(403)
        .json({ message: `user role ${req.user.role} is not allow to update` });
    }
    next();
  };
};

// Grant access for delete
exports.authorizeDelete = () => {
  return async (req, res, next) => {
    if (!req.user.d) {
      return res
        .status(403)
        .json({ message: `user role ${req.user.role} is not allow to delete` });
    }
    next();
  };
};
