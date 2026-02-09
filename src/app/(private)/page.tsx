export default async function Home() {
  class User {
    constructor(public name: string) {
      this.name = name;
    }
  }

  const user = new User("승주");

  return <div></div>;
}
