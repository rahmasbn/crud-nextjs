import nc from "next-connect";
import { getProducts, addProduct } from "controller/products";

const handler = nc();

handler.get(getProducts);
handler.post(addProduct);

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
