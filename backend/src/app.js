const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("redis");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const companyRoutes = require("./routes/company.routes");
const projectRoutes = require("./routes/project.routes");
const nodeRoutes = require("./routes/node.routes");
const alertRoutes = require("./routes/alert.routes");
const sensorRoutes = require("./routes/sensor.routes");
const thresholdRoutes = require("./routes/threshold.routes");
const { authenticate } = require("./middlewares/auth.middleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/docs", express.static(path.join(__dirname, "..", "docs")));
app.use("/coverage", express.static(path.join(__dirname, "..", "coverage")));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/nodes", nodeRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/thresholds", thresholdRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal" });
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

const clients = []; // clientes SSE conectados

// Inicializar SSE - Server-Sent Events
app.get("/sse/alerts", authenticate, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  clients.push(res);

  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

// Redis - subscriber
const redisSubscriber = createClient();

redisSubscriber.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisSubscriber
  .connect()
  .then(() => {
    redisSubscriber.subscribe("alerts", (message) => {
      const alert = JSON.parse(message);
      const data = `data: ${JSON.stringify(alert)}\n\n`;
      clients.forEach((client, i) => {
        try {
          client.write(data);
        } catch (error) {
          console.error(`Error sending to client #${i + 1}:`, error);
          // Remove failed client
          clients.splice(i, 1);
        }
      });
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await redisSubscriber.quit();
  process.exit(0);
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
