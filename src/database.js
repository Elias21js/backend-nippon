import { Pool } from "pg";
import { configDotenv } from "dotenv";
configDotenv();

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // isso é OK no Supabase
  },
});

export default database;

import dns from "dns/promises";

async function testDNS() {
  try {
    const addresses = await dns.lookup("veynefhtqglmilhpfbrn.supabase.co");
    console.log("DNS lookup success:", addresses);
  } catch (e) {
    console.error("DNS lookup failed:", e);
  }
}

testDNS();

database
  .query("SELECT 1")
  .then(() => console.log("✅ Banco conectado com sucesso"))
  .catch((err) => console.error("❌ Falha ao conectar banco:", err));
