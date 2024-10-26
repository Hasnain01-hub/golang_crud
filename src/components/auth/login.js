import React from "react";
import { useSelector } from "react-redux";

const Login = () => {
  const { user } = useSelector((state) => ({ ...state }));
  React.useEffect(() => {
    if (user.user && user.user.email) {
      return (window.location.href = "/home");
    }
  }, [user.user]);
  const handleLogin = async () => {
    window.location.href = "http://localhost:8000/api/auth/login/google";
  };

  return (
    <>
      <section class="h-screen">
        <div class="container h-full px-6 py-24">
          <div class="flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div class="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
              <div className="header">
                <p style={{ color: "black" }}>TODO App</p>
              </div>
              <img
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                class="w-full"
                alt="Phone image"
              />
            </div>

            <div class="md:w-8/12 lg:ms-6 lg:w-5/12">
              <form>
                <div
                  class="mb-3 flex w-full items-center justify-center rounded bg-info px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-info-3 transition duration-150 ease-in-out hover:bg-info-accent-300 hover:shadow-info-2 focus:bg-info-accent-300 focus:shadow-info-2 focus:outline-none focus:ring-0 active:bg-info-600 active:shadow-info-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                  style={{ backgroundColor: "#55acee" }}
                  role="button"
                  onClick={() => handleLogin()}
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                >
                  <span class="me-2 fill-white [&>svg]:h-3.5 [&>svg]:w-3.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path>
                    </svg>
                  </span>
                  &nbsp;Google
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
