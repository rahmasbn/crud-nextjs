import nc from "next-connect";
import { deleteProductById, editProductById } from "controller/products";

const handler = nc();
handler.patch(editProductById);
handler.delete(deleteProductById);

export default handler;

export const config = {
    api: {
      bodyParser: false,
    },
  };