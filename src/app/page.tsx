import { getMockData } from "@/apis/getMockData";

export default async function Home() {
  const mockData = await getMockData();
  console.log(mockData);
  return <h1>Hello World</h1>;
}
