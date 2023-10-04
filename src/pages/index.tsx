import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { HeroBullets } from "~/components/HeroBullets";

const Home = () => {
  const { user } = useUser();
  const { push } = useRouter();

  if (user) {
    push("/dashboard");
    return null;
  }
  return <HeroBullets />;
};

export default Home;
