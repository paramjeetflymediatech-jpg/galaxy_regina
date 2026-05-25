import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import InsuranceClaims from "@/src/components/InsuranceClaims/InsuranceClaims";

export default function InsuranceClaimsPage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <InsuranceClaims />
      </main>
      <Footer />
    </>
  );
}
