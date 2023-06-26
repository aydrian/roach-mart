import type { Product } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction
} from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { ProductCard } from "~/components/product-card";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Roach Mart: Product Catalog" }];
};

export const loader: LoaderFunction = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc"
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

  return json({ products });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();

  const intent = await form.get("intent");

  if (intent === "addToCart") {
    const productId = form.get("id");
    invariant(typeof productId === "string", `productId must be a string`);

    await prisma.cartItem.create({
      data: { productId, userId }
    });
    return json("Created", { status: 201 });
  }

  return "ok";
};

export default function Catalog() {
  const { products } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="bg-gradient-to-br from-crl-deep-purple from-45% via-crl-dark-blue to-crl-electric-purple">
        <div className="container mx-auto py-12 md:max-w-4xl">
          <h1 className="bg-gradient-to-r from-crl-iridescent-blue via-crl-electric-purple to-crl-iridescent-blue bg-clip-text text-center font-poppins text-3xl font-semibold leading-tight text-transparent md:text-6xl">
            Shop fast, find anything, thrive everywhere
          </h1>
        </div>
      </div>
      <div className="container bg-[url('/images/bg-texture.svg')] bg-auto bg-left-top bg-no-repeat pt-10">
        <h2 className="text-center font-poppins text-2xl font-semibold text-crl-deep-purple md:text-4xl">
          Latest Products
        </h2>
        <div className="flex w-full flex-col justify-center gap-8 py-10 text-center sm:flex-row sm:flex-wrap">
          {products.map((product: Product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </>
  );
}
