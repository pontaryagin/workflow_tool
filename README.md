This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started(Dev)
### dot env
- copy file
```
cp .env.sample .env
```

- update UID, GID
- create docker-compose.override.yml

### docker
```
docker compose up -d
```

### prisma
```
docker compose run next-app npx prisma generate
```

## Deploy
docker compose -f docker-compose.prod.yml up -d

## Add UI
https://ui.shadcn.com/
```bash
npx shadcn-ui@latest add <Component Name>
```

## Create sample for DB
```
./dev-script/init.sh
```


## Migrate DB
```
npx prisma migrate dev --name <name of operation>
```

## Reset DB
Reset all data and migrate
```
npx prisma migrate reset
```
