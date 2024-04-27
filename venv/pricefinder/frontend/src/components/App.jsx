import { useState, useEffect } from "react";
import "../css/App.css";

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolls, setScrolls] = useState(5);
  const [filters, setFilters] = useState({
    qualityVendor: false,
    freeDelivery: false,
    hasRatings: false,
    lowestPrice: false,
    highestRatings: false,
    maxPrice: 99999999999999999999999999, //oh yeah
  });

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getScrape = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/runscraper/${searchQuery} shopping`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scrolls: scrolls,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const jsonData = await response.json();
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    getScrape();
  };

  const handleFilterChange = (filterName, isChecked) => {
    setFilters({ ...filters, [filterName]: isChecked });
  };

  const handleMaxPriceChange = (e) => {
    setFilters({ ...filters, maxPrice: e.target.value });
  };

  const handleScrollChange = (e) => {
    setScrolls(e.target.value);
  };

  const handleRevertButtonClick = () => {
    setFilters({ ...filters, maxPrice: 99999999999999999999999999 });
    fetchData();
  };

  const convertPriceToFloat = (priceString) => {
    // Remove dollar sign and commas
    const cleanedPrice = priceString.replace(/\$|,/g, "");
    // Parse to float
    return parseFloat(cleanedPrice);
  };

  const filteredData = data.filter((item) => {
    if (filters.qualityVendor && !item.top_quality_vendor) {
      return false;
    }
    if (filters.freeDelivery && !item.free_delivery) {
      return false;
    }
    if (
      filters.maxPrice !== 99999999999999999999999999 &&
      convertPriceToFloat(item.price) > parseFloat(filters.maxPrice)
    ) {
      return false;
    }
    return true;
  });

  const filteredResults = filteredData.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>{item.price}</td>
      <td>{item.rating || "-"}</td>
      <td>
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      </td>
      <td>
        {item.free_delivery ? (
          <img src="../src/assets/delivery-icon.png" id="delivery-icon" />
        ) : null}
      </td>
      <td>
        {item.top_quality_vendor ? (
          <img src="../src/assets/top-quality-icon.png" id="vendor-icon" />
        ) : null}
      </td>
    </tr>
  ));

  const resultsTable = () => {
    return (
      <div className="table-container">
        <table className="table" id="results-table">
          <thead className="sticky-header">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Link</th>
              <th>Free Delivery</th>
              <th>Quality Vendor</th>
            </tr>
          </thead>
          <tbody>{filteredResults}</tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png"
          id="react-logo"
        />
      </a>
      <a
        href="https://www.djangoproject.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://static-00.iconduck.com/assets.00/django-icon-1606x2048-lwmw1z73.png"
          id="django-logo"
        />
      </a>
      <a
        href="https://www.selenium.dev/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://static-00.iconduck.com/assets.00/selenium-icon-2048x1986-3fr2ikf8.png"
          id="selenium-logo"
        />
      </a>
      <div className="top-left-container">
        <img
          src="../src/assets/appicon.png"
          id="top-left-icon"
          alt="App Icon"
        />
        <p>Price Finder</p>
      </div>
      <div className="search-container">
        <p>What product do you want to buy?</p>
        <form onSubmit={handleSearchFormSubmit}>
          <div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="searchquery"
                aria-describedby="Search Query"
                value={searchQuery}
                autoComplete="off"
                onChange={handleSearchInputChange}
              />
            </div>
            <button type="submit" className="btn btn-success" id="search-btn">
              GO!
            </button>
            <div>
              <p style={{ fontSize: "15px", marginTop: "10px" }}>
                Give the app a minute to load after pressing go
              </p>
              <p style={{ fontSize: "10px", marginTop: "0px" }}>
                *More data sets means more load time
              </p>
            </div>
          </div>
        </form>
      </div>
      <div className="filter-container">
        <div className="filter-inner-container" style={{ marginLeft: "10px" }}>
          <p id="filter-heading">Filters</p>
          <form>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="top-quality"
                checked={filters.qualityVendor}
                onChange={(e) =>
                  handleFilterChange("qualityVendor", e.target.checked)
                }
              />
              <label
                className="form-check-label text-light"
                htmlFor="topquality"
              >
                Top quality vendor
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="free-delivery"
                checked={filters.freeDelivery}
                onChange={(e) =>
                  handleFilterChange("freeDelivery", e.target.checked)
                }
              />
              <label
                className="form-check-label text-light"
                htmlFor="free-delivery"
              >
                Free delivery
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="has-ratings"
              />
              <label
                className="form-check-label text-light"
                htmlFor="has-ratings"
              >
                Has ratings
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="max-price" className="form-label text-light">
                Max Price
              </label>
              <input
                type="number"
                class="form-control"
                id="max-price"
                style={{ height: "20px" }}
                value={
                  filters.maxPrice === 99999999999999999999999999
                    ? ""
                    : filters.maxPrice
                }
                onChange={handleMaxPriceChange}
              />
            </div>
            <div className="max-btn-container">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRevertButtonClick}
                id="revert-btn"
              >
                Revert
              </button>
            </div>
          </form>
        </div>
        <div className="filter-inner-container">
          <div style={{ width: "50%", marginLeft: "50px" }}>
            <p id="filter-heading">Sort</p>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="lowest-price"
              />
              <label
                className="form-check-label text-light"
                htmlFor="lowest-price"
              >
                Lowest price
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="ratings"
              />
              <label className="form-check-label text-light" htmlFor="ratings">
                Highest ratings
              </label>
            </div>
            <div className="mb-3" style={{ marginTop: "-5px" }}>
              <label
                htmlFor="max-price"
                className="form-label text-light"
                style={{ fontSize: "12px" }}
              >
                Data sets collected (~70 per)
              </label>
              <input
                type="number"
                class="form-control"
                id="max-price"
                style={{ height: "20px" }}
                value={scrolls}
                onChange={handleScrollChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="results-container">
        <div>
          <p className="results-heading">Results ({data.length})</p>
          {resultsTable()}
        </div>
      </div>
    </>
  );
}

export default App;
