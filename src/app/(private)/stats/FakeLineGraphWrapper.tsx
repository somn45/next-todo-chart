import FakeLineGraph from "./FakeLineGraph";
const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default async function FakeLineGraphWrapper() {
  await delay(3000);

  return <FakeLineGraph />;
}
