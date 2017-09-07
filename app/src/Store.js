import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

const reducer = combineReducers({
  
});

const win = window;

const middlewares = [thunkMiddleware];

const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  (win && win.devToolsExtension) ? win.devToolsExtension() : (f) => f,
);

export default createStore(reducer, {}, storeEnhancers);

