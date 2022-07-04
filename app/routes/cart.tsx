import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function Cart() {
  return <div>Cart</div>;
}
