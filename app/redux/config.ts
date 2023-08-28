const reduxPersistTimeoutEnv = process.env.REDUX_PERSIST_TIMEOUT
export const _reduxPersistTimeout = reduxPersistTimeoutEnv && !isNaN(+reduxPersistTimeoutEnv) 
  ? +reduxPersistTimeoutEnv
  : 10000;

export const reduxPersistTimeout = process.env.NODE_ENV === "production" ? undefined : _reduxPersistTimeout;

