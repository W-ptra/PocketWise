# Backend
## Prequisite
1. ``Nodejs`` version 20.x or above
2. Have ``PostgreSQL`` installed and running
3. Create ``.env`` file, with value you can copy it from ``.example.env``
## How to run locally
run following script
```
npm install
npx prisma migrate dev
npx prisma generate
npm run start
```