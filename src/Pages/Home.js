import React, { useState } from "react";
import Banner from "../components/Banner";
import RecentProducts from "../components/HomePage/RecentProducts";
import Features from "../components/HomePage/Features";
import Testimonials from "../components/HomePage/Testimonials";
import Counter from "../components/HomePage/Counter";
import Contact from "../components/HomePage/Contact";
import HomePageFeatureProducts from "../components/HomePage/HomePageFeatureProducts";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

 
  return (
    <>
      <Banner onSearch={handleSearch} />
      <HomePageFeatureProducts></HomePageFeatureProducts>
      <RecentProducts searchQuery={searchQuery} />
      <Features />
      <Testimonials />
      <Counter />
      <Contact />
    </>
  );
};

export default Home;
