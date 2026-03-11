import express from "express";
import cors from "cors";
import { env } from "@/common/config/env";
import { errorHandler } from "@/common/middleware/error.handler";
import { notFoundHandler } from "@/common/middleware/not-found";
import routes from "@/routes";
import "@/common/lib/cloudinary";

const app = express();

if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const allowedOrigins = [env.FRONTEND_URL];

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser requests like Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;