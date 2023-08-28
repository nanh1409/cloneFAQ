const createNoopStorage = () => ({
  getItem: (_key: string) => null,
  setItem: (_key: string, value: any) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve()
});

export default createNoopStorage;