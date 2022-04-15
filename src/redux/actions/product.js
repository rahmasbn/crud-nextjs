import { ACTION_STRING } from "src/redux/actions/actionString";
import axios from "axios";
import { useRouter } from "next/router";

import {
  deleteProducts,
  editProducts,
  getAllProducts,
  postProduct,
} from "modules/utils/product";

const getProducts = (products) => ({
  type: ACTION_STRING.getProduct,
  payload: products,
});

const productDeleted = () => ({
  type: ACTION_STRING.deleteProduct,
});

const productAddedSuccess = () => ({
  type: ACTION_STRING.addProductSuccess,
});

const productAddedFailure = (err) => ({
  type: ACTION_STRING.addProductFailure,
  payload: err,
});

const productUpdatedSuccess = () => ({
  type: ACTION_STRING.updateProductSuccess,
});
const productUpdatedFailure = (err) => ({
  type: ACTION_STRING.updateProductFailure,
  payload: err,
});

export const loadProducts = (page, keyword) => {
  return (dispatch) => {
    getAllProducts(page, keyword)
      .then((res) => {
        console.log("data action", res);
        dispatch(getProducts(res.data.result));
      })
      .catch((err) => console.log(err));
  };
};

export const addProduct = (body, page, keyword) => {
  return (dispatch) => {
    postProduct(body)
      .then((res) => {
        console.log("add action", res);
        dispatch(productAddedSuccess());
        dispatch(loadProducts(page, keyword));
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(productAddedFailure(err.response.data));
      });
  };
};

export const editProduct = (body, id, page, keyword) => {
  return (dispatch) => {
    editProducts(body, id)
      .then((res) => {
        console.log("edit action", res);
        dispatch(productUpdatedSuccess());
        dispatch(loadProducts(page, keyword));
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(productUpdatedFailure(err.response.data));
      });
  };
};

export const deleteProduct = (id) => {
  return (dispatch) => {
    deleteProducts(id)
      .then((res) => {
        console.log("delete action", res);
        dispatch(productDeleted());
        dispatch(loadProducts(page, keyword));
      })
      .catch((err) => console.log(err));
  };
};
