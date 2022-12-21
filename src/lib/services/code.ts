import axios from "axios";

export const getCodeIdInfo = async (endpoint: string, id: number) => {
  const { data } = await axios.get(`${endpoint}/cosmwasm/wasm/v1/code/${id}`);
  return data;
};
