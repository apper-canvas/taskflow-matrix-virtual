import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const HomeIcon = getIcon('Home');
  const AlertTriangleIcon = getIcon('AlertTriangle');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-900"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft dark:bg-gray-800 sm:p-10">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertTriangleIcon className="h-10 w-10 text-red-500 dark:text-red-400" />
        </div>
        
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">404</h1>
        <h2 className="mb-4 text-xl font-medium text-gray-700 dark:text-gray-300 sm:text-2xl">Page Not Found</h2>
        
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <HomeIcon className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;