import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <main className="justify-center flex flex-col items-center">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.statusText || error?.message || "Unknown error"}</i>
      </p>
    </main>
  );
};

export default ErrorPage;