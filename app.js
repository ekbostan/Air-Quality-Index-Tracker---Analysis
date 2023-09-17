const express = require("express");
const { createClient } = require("redis");
const dotenv = require('dotenv');
const uvIndexRouter = require("./routes/uvIndexRouter");

dotenv.config({ path: './config.env' }); // Load environment variables

const app = express();
app.use(express.json());

// Initializing Redis client
const redisClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retry_strategy: function(options) {
        if (options.error && options.error.code === "ECONNREFUSED") {
            console.error("Redis connection refused:", options.error);
            return new Error("The server refused the connection");
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            console.error("Retry time exhausted");
            return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
            console.error("Max attempts reached");
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000); // Increase delay between attempts
    }
});

redisClient.on("error", (err) => {
    console.log("Redis error:", err);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('end', () => {
    console.log('Redis client disconnected');
});

// Attach the Redis client to the request object for subsequent middlewares and route handlers
app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});

// Define getFromCache and storeInCache functions globally
const getFromCache = (client, key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) reject(err);
            if (data !== null) resolve(JSON.parse(data));
            else resolve(null);
        });
    });
};

const storeInCache = (client, key, data) => {
    client.set(key, JSON.stringify(data), 'EX', 3600); // Expires after 1 hour
};

// Optional: Middleware for caching
const checkCache = async (req, res, next) => {
    if (!req.redisClient || !req.redisClient.connected) {
        return next(); // Skip caching if client isn't connected
    }

    const key = req.url;  // Use request URL as the cache key

    try {
        const cachedData = await getFromCache(req.redisClient, key);
        
        if (cachedData !== null) {
            return res.status(200).json({
                status: 'success',
                data: cachedData,
                source: 'Redis cache'
            });
        } else {
            next();
        }
    } catch (err) {
        console.error('Redis error:', err);
        next(); // Continue even if there's an error
    }
};

app.use("/api/uvindex", checkCache, uvIndexRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
