import axios from 'axios';

export async function getResponseData<T>(url: string) {
  const response = await axios.get<T>(url);
  if (response.status !== 200) {
    throw new Error(`status code: ${response.status}`);
  }
  return response.data;
}
