import './Home.css'; // Importing regular CSS
import BannerImage from "/banner.png";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            PEER <br/> SPHERE 
          </h1>
          <p className="primary-text">
          Teach, learn & earn through peer-to-peer tutoring and open discussions  
          </p>
          <button className="secondary-button">
            Start Learning Today!
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="Banner Image" className="sticky-image"/>
        </div>
      </div>

    </div>
  );
};

export default Home;