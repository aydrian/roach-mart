# Row-Level TTL with CockroachDB

This application demonstrates [Row-Level TTL](https://www.cockroachlabs.com/docs/stable/row-level-ttl.html#:~:text=1%3A%20CockroachDB%20has%20preview%20support,than%20a%20specified%20expiration%20time.) on CockroachDB. Items added to your cart will expire after a set amount of time.

## 🥞 Stack

- Framework - [Remix](https://remix.run/)
- Language - [TypeScript](https://www.typescriptlang.org/)
- Database - [CockroachDB Serverless](https://www.cockroachlabs.com/product/)
- ORM - [Prisma](https://prisma.io/)
- Hosting - [Vercel](https://vercel.com/)
- Styling - [Chakra UI](https://chakra-ui.com/)

## Setup

1. Clone this repo
1. Create a `.env` file using the provided `.env.example`
   ```
   cp .env.example .env
   ```
1. Create a [free CockroachDB Serverless account and cluster](https://cockroachlabs.cloud/signup?referralId=sample_app)

1. Add your database url to the `.env` file
1. Run Prisma migrate to create the database schema
   ```
   npx prisma migrate deploy
   ```
1. Run `row-level-ttl.sql` script to activate row level ttl
   ```
   npx prisma db execute --file ./prisma/row-level-ttl.sql --schema schema.prisma
   ```
1. Update the `SESSION_SECRET` variable with any string in your `.env` file.

## Development

To run the app locally, make sure the project's local dependencies are installed:

```sh
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.

## Deployment

This application has been setup to use Vercel as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

## 📝 License

Copyright © 2023 [Cockroach Labs](https://cockroachlabs.com). <br />
This project is [MIT](./LICENSE) licensed.
