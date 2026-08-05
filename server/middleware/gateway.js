import rateLimit from 'express-rate-limit';

// Gateway Rate Limiter to prevent DDoS / Spam
export const apiGatewayLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 300, // Tối đa 300 requests mỗi 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Cổng API Gateway phát hiện quá nhiều truy cập từ IP này. Vui lòng thử lại sau ít phút.'
  }
});

export const requestLogger = (req, res, next) => {
  console.log(`[API Gateway] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
};
