import { Header, Footer } from "./layout";
import BilletsList from "./components/billets";

export default function Page() {
  return (
    <main className="min-h-screen px-4 py-10">
      <Header />
      <div className="mx-auto max-w-4xl">
        <BilletsList />
      </div>
      <Footer />
    </main>
  );
}
