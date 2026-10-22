
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
  
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid request data"
      });
    }
  
    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid resource ID or value"
      });
    }
  
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Resource already exists"
      });
    }
  
    console.error("Unhandled request error:", err);
  
    return res.status(500).json({
      message: "Internal server error"
    });
  }
  
  module.exports = { errorHandler };
  