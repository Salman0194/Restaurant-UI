import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Foodie</h1>

        <p className="about-intro">
          Welcome to <strong>Foodie</strong> — your favorite destination for
          delicious food delivered fast and fresh.
        </p>

        <div className="about-section">
          <h2>🍽 Our Story</h2>
          <p>
            Foodie was created with a simple mission: to connect people with
            great food. From traditional flavors to modern favorites, we bring
            restaurant-quality meals straight to your doorstep.
          </p>
        </div>

        <div className="about-section">
          <h2>🚀 What We Do</h2>
          <ul>
            <li>Browse a curated menu of delicious dishes</li>
            <li>Order food easily with a smooth checkout</li>
            <li>Track your orders in real time</li>
            <li>Fast and reliable delivery</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>❤️ Why Choose Us</h2>
          <p>
            We focus on quality, speed, and customer satisfaction. Every order
            is prepared with care and delivered with a smile.
          </p>
        </div>

        <div className="about-footer">
          <p>
            Thank you for choosing <strong>Foodie</strong>.  
            We’re happy to serve you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
