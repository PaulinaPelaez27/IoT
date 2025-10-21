# 📡 Sistema de Gestión de Sensores IoT

Sistema web que permite la gestión de empresas, proyectos, nodos y sensores IoT, con recepción de datos en tiempo real, visualización en dashboards y configuración de alertas inteligentes.

---

## 🚀 Funcionalidades principales

- Autenticación con JWT y roles (Administrador / Usuario)
- Gestión de empresas, proyectos, nodos y sensores
- Asociación de tipos de datos a sensores
- Registro automático de lecturas cada 2 segundos
- Visualización dinámica de los datos en gráficos
- Configuración de umbrales por tipo de sensor
- API RESTful documentada con Swagger
- Interfaz moderna con Angular y Angular Material

---

## 🏗️ Tecnologías utilizadas

### Backend:

- Node.js + Express.js
- Prisma ORM
- MySQL
- MQTT (Mosquitto)
- JWT para autenticación
- Swagger para documentación

### Frontend:

- Angular 19
- Chart.js para gráficos
- Angular Material

---

## 📦 Instalación

1. Clonar el proyecto
```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git  
   cd tu-repositorio
```
2. Backend
```bash
   cd backend  
   npm install  
   npx prisma generate  
   npx prisma migrate dev --name init  ## Desde --name init solo se usa cuando esta en blanco. Cuando ya se tiene informacion solo hasta dev
   npm run dev
```
3. Frontend
```bash
   cd frontend  
   npm install  
   ng serve
```
---

4. Redis
```bash



```
  

## 🔐 Variables de entorno `.env`

Crea un archivo `.env` en la carpeta `backend`:

Ejemplo:
```
   DATABASE_URL=mysql://usuario:contraseña@localhost:3306/iot_system  
   JWT_SECRET=miClaveSuperSecreta  
   MQTT_BROKER_URL=mqtt://localhost:1883
```

---
## 📘📄 Documentación y Cobertura

Durante el desarrollo, se han generado dos tipos de documentación accesibles desde el navegador:

📘 **Documentación de la API (Swagger)**  
Accesible desde: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
Esta documentación describe todas las rutas disponibles, los modelos utilizados y los esquemas de seguridad.

📙 **Documentación del código fuente (JSDoc)**  
Accesible desde: [http://localhost:3000/docs](http://localhost:3000/docs)  
Generada automáticamente con comentarios JSDoc en los servicios del backend.

📊 **Informe de cobertura de tests**  
Accesible desde: [http://localhost:3000/coverage](http://localhost:3000/coverage)  
Muestra qué porcentaje del código ha sido cubierto por las pruebas (unitarias o de integración).

---

## 📊 Visualización de datos

Las lecturas de los sensores se registran automáticamente cada 2 segundos y se actualizan en tiempo real en los dashboards del usuario.

---

## 👥 Roles del sistema

| Rol           | Permisos principales                                        |
| ------------- | ----------------------------------------------------------- |
| Administrador | Gestión completa del sistema (empresas, nodos, sensores)    |
| Usuario       | Acceso a dashboards de su proyecto y configuración personal |

---

## 🔔 Funcionalidades futuras

- Integración de algoritmos de predicción de fallos con ML
- Alertas en tiempo real por correo o notificaciones push
- Exportación de reportes en PDF
