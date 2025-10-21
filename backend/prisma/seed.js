const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Inserción de datos
  await prisma.empresas.createMany({
    data: [
      {
        e_nombre: "EcuadorTech S.A.",
        e_direccion: "Av. Amazonas 1345, Quito",
        e_numero_tel: "022123456",
      },
      {
        e_nombre: "Andes Soluciones",
        e_direccion: "Calle Chile y Aguirre, Guayaquil",
        e_numero_tel: "042123456",
      },
      {
        e_nombre: "Control Climático Loja",
        e_direccion: "Av. Universitaria y Av. Manuel Agustín Aguirre, Loja",
        e_numero_tel: "072123456",
      },
      {
        e_nombre: "Innovaciones Tungurahua",
        e_direccion: "Av. Cevallos y Montalvo, Ambato",
        e_numero_tel: "032123456",
      },
      {
        e_nombre: "ClimaSmart S.A.",
        e_direccion: "Av. Remigio Crespo y Cornelio Merchán, Cuenca",
        e_numero_tel: "072123456",
      },
      {
        e_nombre: "SensorData Ecuador",
        e_direccion: "Av. 6 de Diciembre y Naciones Unidas, Quito",
        e_numero_tel: "022123456",
      },
      {
        e_nombre: "ElectroCloud Systems",
        e_direccion: "Malecón Simón Bolívar y 9 de Octubre, Guayaquil",
        e_numero_tel: "042123456",
      },
      {
        e_nombre: "Carchi Electrónica",
        e_direccion: "Av. Bolívar y Av. Carchi, Tulcán",
        e_numero_tel: "062123456",
      },
      {
        e_nombre: "IoT Solutions Riobamba",
        e_direccion: "Av. Daniel León Borja y Av. de los Shyris, Riobamba",
        e_numero_tel: "032123456",
      },
      {
        e_nombre: "Ambiente Inteligente",
        e_direccion: "Av. 10 de Agosto y Av. El Inca, Quito",
        e_numero_tel: "022123456",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.proyectos.createMany({
    data: [
      {
        p_nombre: "proyecto test",
        p_descripcion: "dev data",
        p_empresa_id: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.nodos.createMany({
    data: [
      {
        n_nombre: "Sistema hibernadero",
        n_ubicacion: "planta baja",
        n_proyecto_id: null,
        n_estado: "MANTENIMIENTO",
      },
      {
        n_nombre: "Sistema foltovoltaico",
        n_ubicacion: "loc node1",
        n_proyecto_id: 1,
        n_estado: "MANTENIMIENTO",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.tipos_lectura_sensor.createMany({
    data: [
      {
        tls_nombre: "brillo",
        tls_unidad: "lux",
        tls_descripcion: null,
      },
      {
        tls_nombre: "corriente",
        tls_unidad: "A",
        tls_descripcion: "Mide la corriente generada por los paneles",
      },
      {
        tls_nombre: "voltaje",
        tls_unidad: "V",
        tls_descripcion: "Mide la tension entre terminales",
      },
      {
        tls_nombre: "irradiancia",
        tls_unidad: "W/m²",
        tls_descripcion: "Mide la energia solar incidente en una area",
      },
      {
        tls_nombre: "temperatura",
        tls_unidad: "C°",
        tls_descripcion:
          "Temperatura ambiente medida por el sensor, expresada en grados Celsius (°C).",
      },
      {
        tls_nombre: "humedad",
        tls_unidad: "%",
        tls_descripcion: "Humedad relativa del aire",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.roles_usuario.createMany({
    data: [
      {
        ru_nombre: "admin",
        ru_descripcion: null,
      },
      {
        ru_nombre: "user",
        ru_descripcion: null,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.usuarios.createMany({
    data: [
      {
        u_nombre: "admin-dev",
        u_email: "admin@email.com",
        u_contrasena:
          "$2y$10$K3Pfj0CiBqukj0qtIsQLA./2SZLG5Z94cg9pNhuUTvXcPXa0m/uM6",
        u_rol_id: 1,
        u_empresa_id: null,
      },
      {
        u_nombre: "user-dev",
        u_email: "user@email.com",
        u_contrasena:
          "$2y$10$ya31jyNfYQnDSu1qUVII.exGNT05GBf773lXrwk7JCLVYvfw9zStq",
        u_rol_id: 2,
        u_empresa_id: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.sensores.createMany({
    data: [
      {
        s_nombre: "ESP32-DHT11-SIMULADO",
        s_node_id: 1,
        s_estado: "ACTIVO",
      },
      {
        s_nombre: "BH-1750",
        s_node_id: null,
        s_estado: "INACTIVO",
      },
      {
        s_nombre: "INA-219",
        s_node_id: null,
        s_estado: "ACTIVO",
      },
      {
        s_nombre: "ACS-712",
        s_node_id: 2,
        s_estado: "ACTIVO",
      },
      {
        s_nombre: "PIRANOMETRO-1",
        s_node_id: 2,
        s_estado: "ACTIVO",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.lecturas_sensores.createMany({
    data: [
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 24,
        ls_fecha: "2025-07-09T02:02:34.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 46,
        ls_fecha: "2025-07-09T02:02:34.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 25,
        ls_fecha: "2025-07-09T02:02:39.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 53,
        ls_fecha: "2025-07-09T02:02:39.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 30,
        ls_fecha: "2025-07-09T02:02:44.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 39,
        ls_fecha: "2025-07-09T02:02:44.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 27,
        ls_fecha: "2025-07-09T02:02:49.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 54,
        ls_fecha: "2025-07-09T02:02:49.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 23,
        ls_fecha: "2025-07-09T02:02:54.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 37,
        ls_fecha: "2025-07-09T02:02:54.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 20,
        ls_fecha: "2025-07-09T02:02:59.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 41,
        ls_fecha: "2025-07-09T02:02:59.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 21,
        ls_fecha: "2025-07-09T02:03:04.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 33,
        ls_fecha: "2025-07-09T02:03:04.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 31,
        ls_fecha: "2025-07-09T02:03:09.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 40,
        ls_fecha: "2025-07-09T02:03:09.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 24,
        ls_fecha: "2025-07-09T02:03:14.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 44,
        ls_fecha: "2025-07-09T02:03:14.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 20,
        ls_fecha: "2025-07-09T02:03:19.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 40,
        ls_fecha: "2025-07-09T02:03:19.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 28,
        ls_fecha: "2025-07-09T02:03:24.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 34,
        ls_fecha: "2025-07-09T02:03:24.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 29,
        ls_fecha: "2025-07-09T02:03:30.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 31,
        ls_fecha: "2025-07-09T02:03:30.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 20,
        ls_fecha: "2025-07-09T02:03:35.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 38,
        ls_fecha: "2025-07-09T02:03:35.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 26,
        ls_fecha: "2025-07-09T02:03:40.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 41,
        ls_fecha: "2025-07-09T02:03:40.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 26,
        ls_fecha: "2025-07-09T02:03:45.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 34,
        ls_fecha: "2025-07-09T02:03:45.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 32,
        ls_fecha: "2025-07-09T02:03:50.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 39,
        ls_fecha: "2025-07-09T02:03:50.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 33,
        ls_fecha: "2025-07-09T02:03:55.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 53,
        ls_fecha: "2025-07-09T02:03:55.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 32,
        ls_fecha: "2025-07-09T02:04:00.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 56,
        ls_fecha: "2025-07-09T02:04:00.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 33,
        ls_fecha: "2025-07-09T02:04:05.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 42,
        ls_fecha: "2025-07-09T02:04:05.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 29,
        ls_fecha: "2025-07-09T02:04:10.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 1,
        ls_valor: 41,
        ls_fecha: "2025-07-09T02:04:10.000Z",
      },
      {
        ls_sensor_id: 1,
        ls_tipo_id: 2,
        ls_valor: 20,
        ls_fecha: "2025-07-09T02:04:15.000Z",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.umbrales.createMany({
    data: [
      {
        um_sensor_id: 1,
        um_tipo_id: 1,
        um_valor_min: 18,
        um_valor_max: 26,
      },
      {
        um_sensor_id: 1,
        um_tipo_id: 2,
        um_valor_min: 30,
        um_valor_max: 60,
      },
      {
        um_sensor_id: 2,
        um_tipo_id: 3,
        um_valor_min: 0,
        um_valor_max: 10000,
      },
      {
        um_sensor_id: 3,
        um_tipo_id: 4,
        um_valor_min: 0,
        um_valor_max: 10,
      },
      {
        um_sensor_id: 4,
        um_tipo_id: 5,
        um_valor_min: 0,
        um_valor_max: 250,
      },
      {
        um_sensor_id: 5,
        um_tipo_id: 6,
        um_valor_min: 0,
        um_valor_max: 1200,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.tipos_sensor_soportados.createMany({
    data: [
      {
        tss_sensor_id: 1,
        tss_tipo_id: 1,
      },
      {
        tss_sensor_id: 1,
        tss_tipo_id: 2,
      },
      {
        tss_sensor_id: 2,
        tss_tipo_id: 3,
      },
      {
        tss_sensor_id: 3,
        tss_tipo_id: 4,
      },
      {
        tss_sensor_id: 4,
        tss_tipo_id: 5,
      },
      {
        tss_sensor_id: 5,
        tss_tipo_id: 6,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Base de datos reinicializada con éxito");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
