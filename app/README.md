Projeto: Reserva de Espaços - Node.js + Prisma + SQLite

Instruções rápidas (Linux / bash):

1) Instalar dependências
   npm install

2) Gerar Prisma client
   npx prisma generate

3) Criar migration e banco SQLite (vai criar prisma/dev.db):
   npx prisma migrate dev --name init

4) Criar usuário admin (email: admin@if.edu senha: admin123)
   node scripts/seedAdmin.js

5) Iniciar servidor
   npm start

Acesse http://localhost:3000/login
