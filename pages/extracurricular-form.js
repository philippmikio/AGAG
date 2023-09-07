// pages/extracurricular-form.js
import React from 'react';
import ExtracurricularForm from '../pages/form.js'; // Import your form component
import { extracurricular_activities } from '../pages/ag'; // Corrected import path to ag.js
import AG from '../ag'; // Correct relative path
import Form from './form'; // Correct relative path


export async function getStaticPaths() {
  // Fetch data or define the possible paths here
  const paths = [
    { params: { slug: 'page-1' } },
    { params: { slug: 'page-2' } },
    // Add more params as needed
  ];

  return {
    paths,
    fallback: false, // Set this to true if some paths should be handled at runtime
  };
}

function ExtracurricularFormPage() {
  return (
    <div>
      <ExtracurricularForm />
    </div>
  );
}

export default ExtracurricularFormPage;
