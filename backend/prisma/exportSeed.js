const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  // Orden correcto de las tablas, respetando las dependencias entre ellas
  const tablesOrder = [
    "empresas",
    "proyectos",
    "nodos",
    "tipos_lectura_sensor",
    "roles_usuario",
    "usuarios",
    "sensores",
    "lecturas_sensores",
    "umbrales",
    "alertas",
    "alertas_usuarios",
    "tipos_sensor_soportados",
    "datos_crudos",
  ];

  const tables = {};

  //  Extraemos los datos actuales de la base de datos y eliminamos los campos id / created_at
  for (const table of tablesOrder) {
    try {
      const rows = await prisma[table].findMany();
      // Eliminamos los campos de timestamp y id auto-incrementales

      tables[table] = rows.map(
        ({
          e_id,
          e_creado_en, // empresas
          p_id,
          p_creado_en, // proyectos
          n_id,
          n_creado_en, // nodos
          tls_id,
          tls_creado_en, // tipos_lectura_sensor
          ru_id,
          ru_creado_en, // roles_usuario
          u_id,
          u_creado_en, // usuarios
          s_id,
          s_creado_en, // sensores
          ls_id,
          ls_creado_en, // lecturas_sensores
          um_id,
          um_creado_en, // umbrales (evitar conflicto con usuarios)
          a_id,
          a_creado_en, // alertas
          au_id,
          au_creado_en, // alertas_usuarios
          tss_creado_en, // tipos_sensor_soportados
          dc_id,
          dc_recibido_en,
          dc_procesado_en, // datos_crudos
          ...rest
        }) => rest,
      );
    } catch (error) {
      console.warn(
        `Warning: No se pudo extraer datos de la tabla ${table}:`,
        error.message,
      );
      tables[table] = [];
    }
  }

  const lines = [];

  //  Cabecera del archivo seed.js
  lines.push(`const { PrismaClient } = require('@prisma/client');`);
  lines.push(`const prisma = new PrismaClient();\n`);
  lines.push(`async function main() {`);

  //  Insertamos los datos extraídos
  lines.push(`\n  // Inserción de datos por esquemas`);

  // Agrupamos por esquemas para mejor organización
  const schemaGroups = {
    organization: ["empresas", "proyectos"],
    auth: ["roles_usuario", "usuarios"],
    iot: [
      "nodos",
      "tipos_lectura_sensor",
      "sensores",
      "lecturas_sensores",
      "umbrales",
      "tipos_sensor_soportados",
    ],
    alerts: ["alertas", "alertas_usuarios"],
    raw_data: ["datos_crudos"],
  };

  for (const [schema, tablesList] of Object.entries(schemaGroups)) {
    lines.push(`\n  // Esquema: ${schema}`);

    for (const table of tablesList) {
      const rows = tables[table];
      if (!rows || rows.length === 0) {
        lines.push(`  // ${table}: sin datos`);
        continue;
      }

      lines.push(`  await prisma.${table}.createMany({`);
      lines.push(`    data: ${JSON.stringify(rows, null, 4)},`);
      lines.push(`    skipDuplicates: true`);
      lines.push(`  });\n`);
    }
  }

  // Mensaje de éxito
  lines.push(`  console.log("Base de datos reinicializada con éxito");`);
  lines.push(
    `  console.log("Esquemas cargados: organization, auth, iot, alerts, raw_data");`,
  );
  lines.push(`}\n`);
  lines.push(
    `main().catch(console.error).finally(() => prisma.$disconnect());`,
  );

  // Escribimos el archivo
  fs.writeFileSync("prisma/seed.js", lines.join("\n"));
  console.log("Archivo seed.js generado con las nuevas tablas y esquemas");
  console.log("Tablas incluidas:", tablesOrder.join(", "));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
