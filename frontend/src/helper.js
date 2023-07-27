import axios from "axios";

export const getJSON = async function (url, params = {}) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
