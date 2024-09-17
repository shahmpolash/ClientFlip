import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Banner.css';

const Banner = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchValue);
    navigate(`/search?query=${encodeURIComponent(searchValue)}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div
        className="banner-area"
        style={{ background: "url(assets/img/banner/2.png)" }}
      >
        <div className="container">
          <div className="banner-area-inner">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="banner-inner text-center">
                  <h2>
                    Buy and Sell<br />
                    <span>Bulk Digital Assets</span>
                  </h2>
                  <p>
                    Discover a wide range of bulk digital products, including databases, leads, graphic templates, website designs, email templates, Canva templates, and more.
                  </p>
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      className="search-input"
                    />
                    <button onClick={handleSearch} className="search-button">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
