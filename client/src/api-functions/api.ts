import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000",
});

export async function getCamperasPromise() {
  try {
    const response = await client.get("/camperas");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
