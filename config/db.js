import mongoose from "mongoose";

// Serverless-friendly Mongo connection with global cache to reuse between invocations
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.warn("MONGO_URI is not set. Make sure it's configured in Vercel environment variables.");
}

// Use global cache to prevent creating new connections on each lambda invocation
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            // Recommended options can be added here
            // useNewUrlParser and useUnifiedTopology are default in mongoose 6+
        };
        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
        return cached.conn;
    } catch (error) {
        // Don't call process.exit in serverless environment; throw so caller can handle it.
        console.error("MongoDB connection error:", error.message || error);
        throw error;
    }
};