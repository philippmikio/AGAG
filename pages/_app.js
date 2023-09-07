// pages/_app.js
import '../styles/global.css'; // Replace with the path to your global CSS file
import React from 'react';
import App from 'next/app';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
