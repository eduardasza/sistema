const prisma = require('../src/prismaClient');
const bcrypt = require('bcryptjs');

async function main() {
  const email = 'admin@if.edu';
  const exists = await prisma.usuario.findUnique({ where: { email }});
  if (exists) {
    console.log('Admin já existe');
    return;
  }
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email,
      senha: hashed,
      tipo: 'admin'
    }
  });
  console.log('Admin criado:', email, 'senha: admin123');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
