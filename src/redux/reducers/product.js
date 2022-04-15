import { ACTION_STRING } from "src/redux/actions/actionString";

const initialState = {
  dataProducts: {},
  loading: true,
  error: {},
};

const productReducer = (prevState = initialState, action) => {
  const {
    getProduct,
    addProductSuccess,
    addProductFailure,
    deleteProduct,
    updateProductFailure,
    updateProductSuccess,
  } = ACTION_STRING;
  switch (action.type) {
    case getProduct:
      return {
        ...prevState,
        dataProducts: action.payload,
        loading: false,
      };

    case addProductFailure:
      return {
        ...prevState,
        loading: false,
        error: action.payload,
      };

    case updateProductFailure:
      return {
        ...prevState,
        loading: false,
        error: action.payload,
      };

    case updateProductSuccess:
    case addProductSuccess:
    case deleteProduct:
      return {
        ...prevState,
        loading: false,
        error: {}
      };

    default:
      return prevState;
  }
};

export default productReducer;
