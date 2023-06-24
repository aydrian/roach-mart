import type { Product } from "@prisma/client";

import { Form } from "@remix-run/react";

import { Cart } from "./icons";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader>
        <Badge>Sale</Badge>
      </CardHeader>
      <CardContent>
        <img
          alt={product.name}
          className="h-56 w-56 rounded-lg object-cover"
          src={product.imgUrl}
        />
        <div>{product.name}</div>
        <div>{product.description}</div>
        <div>
          {new Intl.NumberFormat("en-US", {
            currency: "USD",
            style: "currency"
          }).format(Number(product.price.toString()))}
        </div>
      </CardContent>
      <CardFooter>
        <Form method="POST" replace>
          <input name="id" type="hidden" value={product.id} />
          <Button
            className="flex w-full items-center justify-center gap-2 bg-crl-dark-blue text-white"
            name="intent"
            type="submit"
            value="addToCart"
          >
            <Cart className="inline-block h-6 w-auto" /> Add to Cart
          </Button>
        </Form>
      </CardFooter>
    </Card>
  );
}
