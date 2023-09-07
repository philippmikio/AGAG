// pages/index.js
import React from 'react';
import AG from '../pages/ag'; // Correct relative path
import Form from '../pages/form'; // Correct relative path

export default function Home() {
  return (
    <div>
      <AG />
      <Form />
    </div>
  );
}