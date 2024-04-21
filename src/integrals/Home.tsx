import SubHome from "../components/SubHome.tsx";
import Testimonial from "../components/Testimonials.tsx";
import Contact from "../components/Contact.tsx";
import Footer from "../components/Footer.tsx";

function Home() {
  return (
    <div className="Home">
      <SubHome />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;