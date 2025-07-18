const db = require('../models');

db.sequelize.sync()
  .then(() => {
    console.log("✅ Tablas sincronizadas (sin borrar datos)");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error al sincronizar:", err);
    process.exit(1);
  });