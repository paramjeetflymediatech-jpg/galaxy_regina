import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import LicenseComponents from "@/src/components/LicenseComponents/LicenseComponents";

export default function LicenseePage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <LicenseComponents />
      </main>
      <Footer />
    </>
  );
}
