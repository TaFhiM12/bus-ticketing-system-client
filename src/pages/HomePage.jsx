import React, { useEffect } from "react";
import HeroSection from "../features/Home/component/HeroSection";
import BusyTicketSteps from "../features/Home/component/BusyTicketSteps";
import About from "../features/Home/component/About";
import PopularBusRoutes from "../features/Home/component/PopularBusRoutes";

const HomePage = () => {
  useEffect(() => {
    document.title = "BUS VARA | Home";
  }, []);

  return (
    <div>
      <section>
        <HeroSection />
      </section>
      <section>
        <BusyTicketSteps />
      </section>
      <section>
        <About />
      </section>
      <section>
        <PopularBusRoutes />
      </section>
    </div>
  );
};

export default HomePage;
