import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import StorageServices from "@/src/components/StorageServices/StorageServices";

export default function StorageServicesPage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <StorageServices />
      </main>
      <Footer />
    </>
  );
}
