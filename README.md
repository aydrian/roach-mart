# Row-Level TTL with CockroachDB

This application demonstrates [Row-Level TTL](https://www.cockroachlabs.com/docs/stable/row-level-ttl.html) on CockroachDB. Items added to your cart will expire after a set amount of time.

## 🥞 Tech Stack

- Web Framework - 💿 [Remix](https://remix.run/)
- Database - 🪳 [CockroachDB](https://www.cockroachlabs.com/)
- Database ORM - △ [Prisma](https://www.prisma.io/)
- Styling - 🍃 [Tailwind CSS](https://tailwindcss.com/)
- UI Components - 🧱 [shadcn/ui](https://ui.shadcn.com/) and [Radix](https://www.radix-ui.com/)
- Hosting - ▲ [Vercel](https://vercel.com/)

## 🧰 Application Setup

1. Clone this repo
1. Create a `.env` file using the provided `.env.example`
   ```
   cp .env.example .env
   ```
1. Update the `SESSION_SECRET` environment variable in your .env to any string or generate one using `openssl rand -hex 32`

## 💾 Database Setup

This application uses Prisma to manage the database.

### 🧳 Migrate Schema Changes

1. Create a [free CockroachDB Serverless account and cluster](https://cockroachlabs.cloud/signup?referralId=sample_app)

1. Update the `DATABASE_URL` environment variable with your CockroachDB connection string.
1. Run Prisma migrate to create the database schema
   ```shell
   npx prisma migrate deploy
   ```

### ⏳ Activate Row-Level TTL for the cart_items table

<sup>This only needs to be done once.</sup>

In a terminal, run the `row-level-ttl.sql` script to activate row-level ttl

```shell
npx prisma db execute --file ./prisma/row-level-ttl.sql
```

> **Note**
> You may want to adjust the default for the expiredAt property in the CartItems model. You can specify the expiredAt date by adding an [`INTERVAL`](https://www.cockroachlabs.com/docs/stable/interval.html#duration-fields) to `NOW()`. Cart items are currently set up to expire after 15 minutes.

## 🧑‍💻 Development

You should be able to develop without the need to be connected.

### 🪳 Set up a local CockroachDB Node

To create a local environment that most closely resembles our production CockroachDB serverless cluster, we'll start a local CockroachDB node running in [demo mode](https://www.cockroachlabs.com/docs/stable/cockroach-demo.html). This will allow us to start a temporary, in-memory CockroachDB single-node cluster with a temporary Enterprise license.

1. [Install CockroachDB](https://www.cockroachlabs.com/docs/v23.1/install-cockroachdb) on our local machine.
1. Make sure your [Prisma Seed file](./prisma/seed.ts) is set up to create any initial data needed.
1. In a terminal window, run `./dbserver_start.sh` to start a local CockroachDB node running in demo mode.
1. Update the `DATABASE_URL` in the your .env file to point to your local database.

   ```shell
    DATABASE_URL="postgresql://root@localhost:26257/roach_mart"
   ```

1. In a new terminal window or tab, run `./dbserver_init.sh`. This script will handle a few tasks:
   - Create the roach_mart database in your local node.
   - Create the schema using Prisma
   - Seed the database using the [Prisma Seed file](./prisma/seed.ts)
   - Activate Row-level TTL on the cart_items table

> **Note**
> If you shut down your local CockroachDB server, you will lose any data added and will need to run the `./dbserver_start.sh` and `./dbserver_init.sh` scripts again.

### 💿 Run the Remix app locally

To run the app locally,

1. Make sure the project's local dependencies are installed:
   ```sh
   npm install
   ```
1. Start the Remix development server like so:
   ```sh
   npm run dev
   ```
1. Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

🎉 You're ready to start developing. Look ma! No interwebs!

> **Note**
> If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.

## 🚧 Deployment

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
