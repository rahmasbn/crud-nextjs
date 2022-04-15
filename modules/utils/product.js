import axios from "axios";

export const getAllProducts = (page, keyword) => {
  const url = `${process.env.NEXT_PUBLIC_HOST}/products?page=${page}&limit=5&keyword=${keyword}`;
  return axios.get(url);
};

export const postProduct = (body) => {
  const url = `${process.env.NEXT_PUBLIC_HOST}/products`;
  return axios.post(url, body);
};

export const editProducts = (body, id) => {
  const url = `${process.env.NEXT_PUBLIC_HOST}/products/${id}`;
  return axios.patch(url, body);
};

export const deleteProducts = (id) => {
  const url = `${process.env.NEXT_PUBLIC_HOST}/products/${id}`;
  return axios.delete(url);
};
