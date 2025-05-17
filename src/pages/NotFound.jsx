import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 text-center dark:bg-surface-900">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-surface-800 dark:text-surface-100">Page Not Found</h2>
      <p className="mt-2 text-surface-600 dark:text-surface-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;