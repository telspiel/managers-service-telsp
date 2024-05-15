import React, {useState, useEffect} from 'react'
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import Endpoints from '../endpoints';


function Dashboard() {

  const [dashboardData, setDashboardData] = useState({
    totalSmsToday: 0,
    totalSmsMonth: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(Endpoints.get('dashboard'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authJwtToken')}`,
          },
          body: JSON.stringify({
            username: localStorage.getItem('loggedInUser'),
          }),
        });

        const data = await response.json();

        console.log('API response:', data);

        if (data.code === 1000 && data.result === 'SUCCESS') {
          setDashboardData({
            totalSmsToday: data.data.totalSmsToday || 0, 
            totalSmsMonth: data.data.totalSmsMonth || 0,
          });
        } else {
          console.log('Failed to fetch dashboard data:', data.message);
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className='dashboard-container'>
      <h2>Dashboard</h2>
      <hr />
      <div className="dashboard-card-container">
        <div className="dashboard-card bgColor1">
          <h3>Today's SMS Count</h3>
          <div className='dashboard-card-content'>
            <FontAwesomeIcon icon={faClock} className="fa" />
            <p>{dashboardData.totalSmsToday}</p>
          </div>
        </div>

        <div className="dashboard-card bgColor2">
          <h3>Current Month SMS Count</h3>
          <div className='dashboard-card-content'>
            <FontAwesomeIcon icon={faCalendarCheck} className="fa" />
            <p>{dashboardData.totalSmsMonth}</p>
          </div>
        </div>
      </div>
      {/* <div className='dashboard-graph'>
        <h3>Graph Content</h3>
      </div> */}
    </div>
  );
}

export default Dashboard