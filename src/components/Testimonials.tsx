import ProfilePic from "/testimonial.png";
import { AiFillStar } from "react-icons/ai";

const Testimonial = () => {
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <h1 className="primary-heading">Who we are?</h1>
        <p className="primary-text">
        Of the students, by the students, for the students. A vibrant cross-college learning platform where peers collaborate, share knowledge, and empower one another to achieve academic success.
        </p>
      </div>
      <div className="testimonial-section-bottom">
      <h1 className="testimonial-heading">Testimonials</h1>

        <img src={ProfilePic} alt="" />
        <p>
        "Peer Sphere has been a game-changer for my academic journey. The wealth of resources, personalized tutoring, and engaging discussions with peers from various colleges have enriched my learning experience. It's truly a platform by students, for students!"
        </p>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <h2>-Will Smith</h2>
      </div>
    </div>
  );
};

export default Testimonial;