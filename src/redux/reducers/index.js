import { combineReducers } from "redux";
import productReducer from "src/redux/reducers/product";


const rootReducer = combineReducers({
  products: productReducer,
});

export default rootReducer;