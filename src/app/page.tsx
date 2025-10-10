import { getMockData } from "@/apis/getMockData";

export default async function Home() {
  const mockData = await getMockData();
  return <h1>Hello World</h1>;
}
