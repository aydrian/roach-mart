import type { Product } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction
} from "@remix-run/node";

import { json } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

import { ProductCard } from "~/components/product-card";
import { prisma } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Roach Mart: Catalog" }];
};

export const loader: LoaderFunction = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "asc"
    },
    select: {
      description: true,
      id: true,
      imgUrl: true,
      name: true,
      price: true,
      units: true
    }
  });

  return typedjson({ products });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();

  const intent = await form.get("intent");

  if (intent === "addToCart") {
    const productId = form.get("id");
    const productName = form.get("name");
    const productPrice = form.get("price");
    const productImgUrl = form.get("imgUrl");
    invariant(typeof productId === "string", `productId must be a string`);
    invariant(typeof productName === "string", `productName must be a string`);
    invariant(
      typeof productPrice === "string",
      `productPrice must be a string`
    );
    invariant(
      typeof productImgUrl === "string",
      `productImgUrl must be a string`
    );

    await prisma.cartItem.create({
      data: { productId, userId }
    });
    return json("Created", { status: 201 });
  }

  return "ok";
};

export default function Catalog() {
  const { products } = useTypedLoaderData<typeof loader>();
  return (
    <>
      <div className=" bg-crl-deep-purple">
        <div className="container mx-auto max-w-4xl py-12">
          <h1 className="bg-gradient-to-r from-crl-iridescent-blue via-crl-electric-purple to-crl-iridescent-blue bg-clip-text text-center font-poppins text-6xl font-semibold leading-tight text-transparent">
            Shop fast, find anything, thrive everywhere
          </h1>
        </div>
      </div>
      <div className="container">
        <h2 className="my-12 text-center font-poppins text-4xl font-semibold text-crl-deep-purple">
          Products
        </h2>
        <div className="flex w-full flex-col justify-center gap-8 py-10 text-center md:flex-row">
          {products.map((product: Product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </>
  );
}
