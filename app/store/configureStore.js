import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducers'
import syncOffline from './syncOffline'
import { syncFirebase } from '../firebase'

export default function configureStore(initialState) {
  const store = createStore(reducers, applyMiddleware(thunk))
  syncOffline(store)
  syncFirebase(store)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store
}
