import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "src/redux/reducers";

const enhancers = applyMiddleware(thunk, logger);
const store = createStore(rootReducer, enhancers);

export default store;