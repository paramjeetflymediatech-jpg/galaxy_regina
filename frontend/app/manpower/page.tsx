import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import Manpower from "@/src/components/Manpower/Manpower";

export default function StorageServicesPage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Manpower />
      </main>
      <Footer />
    </>
  );
}
