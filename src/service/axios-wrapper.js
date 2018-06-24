import axios from 'axios';

export async function getResponseData(url) {
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error(`status code: ${response.status}`);
  }
  return response.data;
}