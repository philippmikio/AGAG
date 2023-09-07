import React, { useState, useEffect } from 'react';
import { extracurricular_activities } from '../ag';
import { db } from '../firebase';

// Define the fetchData function to fetch data from your source
// Define the fetchData function to fetch data from your source
async function fetchData() {
    try {
      // Fetch the data for 'activityCounts'
      const activityCountsResponse = await db.ref('activityCounts').once('value');
      const activityCountsData = activityCountsResponse.val();
  
      // Fetch the data for 'submissions'
      const submissionsResponse = await db.ref('submissions').once('value');
      const submissionsData = submissionsResponse.val();
  
      // Check if data is not null or undefined
      if (activityCountsData && submissionsData) {
        // Process the data here
        // For example, you can filter, map, or manipulate the data here
  
        // Return the processed data as an object
        return {
          activityCountsData,
          submissionsData,
        };
      } else {
        // Handle the case where data is null or undefined
        console.error('Data not found in Firebase');
        return {
          activityCountsData: {},
          submissionsData: {},
        };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  // Export the async function getStaticProps
  export async function getStaticProps() {
    try {
      // Fetch data using the fetchData function
      const { activityCountsData, submissionsData } = await fetchData();
  
      // Return the data as props
      return {
        props: {
          activityCountsData,
          submissionsData,
        },
      };
    } catch (error) {
      console.error('Error in getStaticProps:', error);
      return {
        props: {
          activityCountsData: {},
          submissionsData: {},
        },
      };
    }
  }
  
  

function ExtracurricularForm() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedActivityDetails, setSelectedActivityDetails] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activityCounts, setActivityCounts] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const submissionsRef = db.ref('submissions');

    submissionsRef.on('value', (snapshot) => {
      const submissions = snapshot.val();
      let counts = {};

      // Process and count each submission
      for (let key in submissions) {
        const activity = submissions[key].selectedActivity;

        if (counts[activity]) {
          counts[activity]++;
        } else {
          counts[activity] = 1;
        }
      }

      // Update the activityCounts state with the computed counts
      setActivityCounts(counts);
    });

    // Detach the listener when the component unmounts
    return () => {
      submissionsRef.off();
    };

    // Fetch data when the component mounts
    fetchData().then((data) => {
      // Process and count data as needed
      let counts = {};

      // ... Count logic ...

      // Set activity counts
      setActivityCounts(counts);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reference to the specific activity count in the database
    const activityRef = db.ref(`activityCounts/${selectedActivity}`);

    activityRef.transaction((currentCount) => {
      // Check if currentCount is less than the Maximum for the selected activity
      if (currentCount === null || currentCount < selectedActivityDetails.Maximum) {
        // If so, increment the count
        return (currentCount || 0) + 1;
      }
      // If we return undefined here, it means we don't change the value in the database
      return undefined;
    }, (error, committed) => {
      if (error) {
        console.error('Transaction failed', error);
      } else if (!committed) {
        // The transaction didn't commit, meaning the activity is full
        alert('Sorry, this activity is now full.');
      } else {
        // The transaction committed, meaning we successfully registered for the activity
        const formData = {
          selectedYear,
          selectedSchool,
          firstName,
          lastName,
          selectedActivity,
        };

        // Push the form data to Firebase
        db.ref('submissions')
          .push(formData)
          .then(() => {
            console.log('Data successfully pushed to Firebase');
            setFormSubmitted(true); // Indicate that the form has been submitted
          })
          .catch((error) => {
            console.error('Error pushing data to Firebase:', error);
          });
      }
    });
  };

  const handleActivityChange = (e) => {
    const selected = e.target.value;
    setSelectedActivity(selected);

    const activityDetails = extracurricular_activities.find(activity => activity.Activity === selected);
    setSelectedActivityDetails(activityDetails);
  };

  return (
    <div className="extracurricular-form">
      <h1>Welcome to the Extracurricular World!</h1>

      {formSubmitted ? (
        // If form is submitted, display the thank you message
        <div style={{ fontSize: '2em', textAlign: 'center', marginTop: '20vh' }}>
          Thank you for your submission
        </div>
      ) : (
        // If form is NOT submitted, display the form
        <form onSubmit={handleSubmit}>

          {/* Dropdown for Jahrgang */}
          <div className="form-group">
            <label>Select Your Grade:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Choose Your Grade</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>
          </div>

          {/* Dropdown for Schule */}
          <div className="form-group">
            <label>Select Your School:</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Select Your School</option>
              <option value="ISB">ISB</option>
              <option value="KOS">KOS</option>
            </select>
          </div>

          {/* Input field for Vorname */}
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!selectedSchool}
            />
          </div>

          {/* Input field for Nachname */}
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!firstName}
            />
          </div>

          {/* Dropdown for AG */}
          <div className="form-group">
            <label>Select an Activity:</label>
            <select
              value={selectedActivity}
              onChange={handleActivityChange}
              disabled={!lastName}
            >
              <option value="">Choose an Activity</option>
              {
                extracurricular_activities
                  .filter(activity => {
                    const currentCount = activityCounts[activity.Activity] || 0;
                    return currentCount < activity.Maximum;
                  })
                  .map(activity => (
                    <option key={activity.Activity} value={activity.Activity}>
                      {activity.Activity}
                    </option>
                  ))
              }

            </select>
          </div>

          {/* Submit button */}
          <button type="submit">Let's Have Fun!</button>

        </form>
      )}

      {/* Display selected activity details in a table */}
      {selectedActivityDetails && (
        <div className="activity-details">
          <table style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th>Description</th>
                <th>When</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ wordWrap: 'break-word' }}>{selectedActivityDetails.Beschreibung}</td>
                <td style={{ wordWrap: 'break-word' }}>{selectedActivityDetails.Wann}</td>
                <td style={{ wordWrap: 'break-word' }}>{selectedActivityDetails.Lehrer}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Rest of your code...

// export async function getStaticProps() {
//   // Fetch data from Firebase or other sources if needed
//   // For example, fetch extracurricular_activities here
//   const data = await fetchData();

//   return {
//     props: {
//       data,
//     },
//   };
// }

export default ExtracurricularForm;
