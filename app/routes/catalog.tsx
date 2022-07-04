import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { Product } from "@prisma/client";

export const loader: LoaderFunction = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      units: true,
      imgUrl: true
    }
  });

  return { products };
};

export default function CatalogRoute() {
  const { products } = useLoaderData();
  const formatCurrency = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });
  return (
    <div>
      <h1>Product Catalog</h1>
      <ul>
        {products.map((product: Product) => {
          return (
            <li key={product.id}>
              <img alt={product.name} src={product.imgUrl} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>{formatCurrency.format(product.price.toNumber())}</p>
              <p>{product.units} left in stock</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
