const express = require('express');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 80;

// Configuración vía variables de entorno (vendrán de ConfigMaps/Secrets en Kubernetes)
const client = new Client({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

client.connect().then(() => console.log("✅ Conectado a DB"))
  .catch(err => {
    console.error("❌ Error de conexión:", err);
    process.exit(1);
  });

app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW()');
    res.send(`Hola Mundo – Fecha: ${result.rows[0].now} – ${process.env.APP_VERSION || "v1"}`);
  } catch (err) {
    res.status(500).send("Error consultando DB");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});