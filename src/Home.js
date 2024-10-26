import React from "react";
import Main from "./components/Main/Main";

const Home = () => {
  React.useEffect(() => {
    let cookieArray = document.cookie.split("; ");
    var token = cookieArray.find((row) => row.startsWith("jwt="));
    token = token ? token.split("=")[1] : null;
    if (!token) {
      return (window.location.href = "/");
    }
  }, []);

  return (
    <>
      <div className="App">
        <div class="absolute bottom-0 right-0 z-[-1]">
          <svg
            width="1440"
            height="886"
            viewBox="0 0 1440 886"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="1508.65"
                y1="2142.58"
                x2="602.827"
                y2="-418.681"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3056D3" stop-opacity="0.36" />
                <stop offset="1" stop-color="#F5F2FD" stop-opacity="0.2" />
                <stop offset="1" stop-color="#F5F2FD" stop-opacity="0.046144" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <Main></Main>
      </div>
    </>
  );
};

export default Home;
