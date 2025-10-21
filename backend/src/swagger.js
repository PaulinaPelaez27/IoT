const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de pre proyecto",
      version: "1.0.0",
      description: "Documentación de la API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuthResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "Token de acceso JWT",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
          required: ["accessToken", "user"],
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID del usuario",
            },
            email: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
            },
            name: {
              type: "string",
              description: "Nombre del usuario",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "Rol del usuario",
            },
            companyId: {
              type: "integer",
              description: "ID de la empresa asociada al usuario",
            },
            company: {
              type: "string",
              description: "Nombre de la empresa asociada al usuario",
              example: "Empresa XYZ",
            },
          },
          required: ["email", "name", "role"],
        },
        Project: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID del proyecto",
              example: 1,
            },
            name: {
              type: "string",
              description: "Nombre del proyecto",
              example: "Proyecto A",
            },
            description: {
              type: "string",
              description: "Descripción del proyecto",
              example: "Sistema de monitoreo ambiental",
            },
            companyId: {
              type: "integer",
              description: "ID de la empresa asociada al proyecto",
              example: 2,
            },
            nodes: {
              type: "array",
              items: {
                type: "integer",
              },
              description: "ID de los nodos asociados al proyecto",
              example: [1, 2, 3],
            },
          },
          required: ["name"],
        },
        Alert: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID de la alerta",
            },
          },
        },
        Node: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID del nodo",
              example: 1,
            },
            name: {
              type: "string",
              description: "Nombre del nodo",
              example: "Nodo Principal",
            },
            location: {
              type: "string",
              description: "Ubicación del nodo",
              example: "Edificio A, Piso 2",
            },
            status: {
              type: "string",
              description: "Estado del nodo",
              example: "activo",
            },
            projectId: {
              type: "integer",
              description: "ID del proyecto al que pertenece el nodo",
              example: 3,
            },
          },
          required: ["name"],
        },
        Company: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID de la empresa",
            },
            name: {
              type: "string",
              description: "Nombre de la empresa",
            },
            address: {
              type: "string",
              description: "Dirección de la empresa",
            },
          },
          required: ["name"],
        },
        Sensor: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID del sensor",
            },
            name: {
              type: "string",
              description: "Nombre del sensor",
            },
            nodeId: {
              type: "integer",
              description: "ID del nodo al que pertenece el sensor",
            },
            type: {
              type: "string",
              description: "Tipo de sensor (ej. temperatura, humedad)",
            },
            unit: {
              type: "string",
              description: "Unidad de medida del sensor (ej. °C, %)",
            },
          },
          required: ["name", "nodeId", "type", "unit"],
        },
        Threshold: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID del umbral",
            },
            sensorId: {
              type: "integer",
              description: "ID del sensor al que pertenece el umbral",
            },
            typeId: {
              type: "integer",
              description: "ID del tipo de umbral",
            },
            minValue: {
              type: "number",
              description: "Valor mínimo del umbral",
            },
            maxValue: {
              type: "number",
              description: "Valor máximo del umbral",
            },
          },
          required: ["sensorId", "typeId", "minValue", "maxValue"],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Operaciones de autenticación y autorización",
      },
      {
        name: "Projects",
        description: "Operaciones relacionadas con proyectos",
      },
      { name: "Alerts", description: "Operaciones relacionadas con alertas" },
      { name: "Nodes", description: "Operaciones relacionadas con nodos" },
      {
        name: "Companies",
        description: "Operaciones relacionadas con empresas",
      },
      { name: "Users", description: "Operaciones relacionadas con usuarios" },
      { name: "Sensors", description: "Operaciones relacionadas con sensores" },
      {
        name: "Thresholds",
        description: "Operaciones relacionadas con umbrales de sensores",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
