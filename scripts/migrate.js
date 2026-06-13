require('dotenv').config();
const { execSync } = require('child_process');

try {
  console.log('Corriendo migraciones...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Migraciones completadas');
} catch (err) {
  console.error('Error en migraciones:', err);
  process.exit(1);
}