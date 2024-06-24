docker compose up db -d
npx prisma migrate reset
npx tsx ./src/dev-script/create_workflow.ts
