import fs from "fs";

import winston from "winston";



const fsPromise = fs.promises;



// Winston logger setup

const logger = winston.createLogger({

  level: "info",

  format: winston.format.combine(

    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

    winston.format.json()

  ),

  defaultMeta: { service: "request-logging" },

  transports: [

    new winston.transports.File({

      filename: "logs.txt",

      maxsize: 5 * 1024 * 1024, // Limit file size to 5MB

    }),

  ],

});



/**

 * Function to get the real IP address of the requester.

 * It considers multiple headers to bypass proxy masking.

 */

const getRealIP = (req) => {

  let ip =

    req.headers["cf-connecting-ip"] || // Cloudflare

    req.headers["x-forwarded-for"]?.split(",")[0].trim() || // First IP from the forwarded list

    req.headers["x-real-ip"] || // Some proxies use this

    req.connection.remoteAddress || // Direct connection

    req.socket?.remoteAddress || // Handle edge cases

    req.info?.remoteAddress; // Some AWS setups



  return ip;

};



// Function to sanitize request body (removes sensitive fields)

const sanitizeBody = (body) => {

  if (!body) return undefined;



  // Create a copy of the body to avoid modifying the original request

  const sanitizedBody = { ...body };



  // Remove or mask sensitive fields

  const sensitiveFields = [

    "password",

    "confirmPassword",

    "newPassword",

    "oldPassword",

    "username",

    "email",

  ];

  sensitiveFields.forEach((field) => {

    if (sanitizedBody[field]) {

      sanitizedBody[field] = "***REDACTED***"; // Replace sensitive info

    }

  });



  return sanitizedBody;

};



// Middleware to log request details securely

const loggerMiddleware = async (req, res, next) => {

  const start = Date.now(); // Track request start time



  res.on("finish", () => {

    const duration = Date.now() - start; // Calculate response time

    const logData = {

      timestamp: new Date().toISOString(),

      ip: getRealIP(req), // Fetch the real IP

      method: req.method,

      url: req.originalUrl,

      userAgent: req.headers["user-agent"],

      status: res.statusCode,

      responseTime: `${duration}ms`,

      body: req.method === "POST" || req.method === "PUT" ? sanitizeBody(req.body) : undefined, // Log sanitized body

    };



    // Avoid logging sensitive routes like sign-in pages

    if (!req.url.includes("signin")) {

      logger.info(logData);

    }

  });



  next();

};



export default loggerMiddleware;