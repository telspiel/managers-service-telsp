/* Get the code of UserSummaryReport.js deployed on UAT before making any new changes -> 14/3/2024*/

import React, {useState, useEffect, useCallback} from 'react'
import './UserSummaryReport.css';
import Endpoints from '../endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

function UserSummaryReport() { 

  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [searchTerm, setSearchTerm] = useState('');
  const [summaryReportData, setSummaryReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState({ column: 'userName', ascending: true });

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const fetchUserSummaryData = async () => {
    try {
      setLoading(true); // Set loading to true before making the API call

      const response = await fetch(Endpoints.get('userSummaryReport'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authJwtToken')}`,
        },
        body: JSON.stringify({
          loggedInUserName: localStorage.getItem('loggedInUser'),
          fromDate,
          toDate,
        }),
      });

      const data = await response.json();

      console.log('API response:', data);

      if (data.code === 14000 && data.result === 'Success') {
        setSummaryReportData(data.data.grid || []);
      } else {
        console.log('Failed to fetch user summary data:', data.message);
      }
    } catch (error) {
      console.error('User summary data fetch error:', error);
    } finally {
      // setTimeout(() => {
      //   setLoading(false); // Set loading to false once we made the API call successfully
      // }, 500);
      setLoading(false); // Set loading to false after the API call is complete
    }
  };

  useEffect(() => {
    fetchUserSummaryData();
  }, [fromDate, toDate]);

  //Handling download functionality of table data in .csv format
  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "USER NAME,SUMMARY DATE,TOTAL REQUEST,TOTAL REJECTED,TOTAL SUBMIT,TOTAL DELIVERED,TOTAL FAILED,TOTAL AWAITED\n" +
      summaryReportData.map(data => Object.values(data).join(',')).join('\n');
  
    // Create a data URI
    const encodedUri = encodeURI(csvContent);
  
    // Create a link element and trigger a click event
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'user_summary_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // const handleSearch = () => {
  //   fetchUserSummaryData();
  // };

  //Filter search in table
  const filterData = () => {
    const dataArray = Array.isArray(summaryReportData) ? summaryReportData : []; // Ensure that summaryReportData is an array

    // Filter data based on the search term
    const filteredData = dataArray.filter(data =>
      Object.values(data).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    return filteredData;
  };

  //To count total amount of each numeric row data
 const calculateColumnTotal = (columnName) => {
  const filteredData = filterData(); 
  return filteredData.reduce((total, data) => total + parseInt(data[columnName], 10), 0);
};

 // Function to handle sorting
 const handleSort = (columnName) => {
  setSortOrder((prevSortOrder) => {
    // If clicking on the same column, toggle the sorting order
    const ascending = prevSortOrder.column === columnName ? !prevSortOrder.ascending : true;

    // Perform sorting
    const sortedData = summaryReportData.slice().sort((a, b) => {
      const aValue = columnName === 'userName' ? a[columnName] : parseInt(a[columnName], 10);
      const bValue = columnName === 'userName' ? b[columnName] : parseInt(b[columnName], 10);

      // Handle alphabetical sorting for 'userName' column
      if (columnName === 'userName') {
        return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      // Handle numerical sorting for other columns
      return ascending ? aValue - bValue : bValue - aValue;
    });

    // Update the state with sorted data
    setSummaryReportData(sortedData);

    return { column: columnName, ascending };
  });
};


  return (
    <div className='user-summary-container'>
        <h2>User Summary Report</h2>
        <hr/>
        <div className="user-summary-card">
        <div className="summary-card-content">
        <label htmlFor="fromDate">From:</label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <label htmlFor="toDate">To:</label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button type="button" onClick={handleDownload}><FontAwesomeIcon icon={faDownload}/></button>

        </div>
        </div>
        <div className="summary-search-container">
        <input
          type="text"
          id="search"
          name="search"
          className="summary-search-input"
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
        <div className="summary-table-container">
        <table className="summary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('userName')}>
                USER NAME
                <FontAwesomeIcon icon={faArrowUp} className='arrowUp' />
                <FontAwesomeIcon icon={faArrowDown} className='arrowDown' />
              </th>
              <th onClick={() => handleSort('summaryDate')}>
                SUMMARY DATE
                <FontAwesomeIcon icon={faArrowUp} className='arrowUp'/>
                <FontAwesomeIcon icon={faArrowDown} className='arrowDown'/>
              </th>
              <th onClick={() => handleSort('totalRequest')}>
                TOTAL REQUEST
                <FontAwesomeIcon icon={faArrowUp} className='arrowUp'/>
                <FontAwesomeIcon icon={faArrowDown} className='arrowDown'/>
              </th>
              <th onClick={() => handleSort('totalRejected')}>
                TOTAL REJECTED
                <FontAwesomeIcon icon={faArrowUp} className='arrowUp'/>
                <FontAwesomeIcon icon={faArrowDown} className='arrowDown'/>
              </th>
              <th onClick={() => handleSort('totalSubmit')}>
                TOTAL SUBMIT
                <FontAwesomeIcon icon={faArrowUp} className='arrowUp'/>
                <FontAwesomeIcon icon={faArrowDown} className='arrowDown'/>
              </th>
              <th onClick={() => handleSort('totalDelivered')}>
                TOTAL DELIVERED
                <FontAwesomeIcon icon={faArrowUp} className='arrowUp'/>
                <FontAwesomeIcon icon={faArrowDown} className='arrowDown'/>
              </th>
              <th onClick={() => handleSort('totalFailed')}>
                TOTAL FAILED
                <FontAwesomeIcon icon={faArrowUp} className='arrowUp'/>
                <FontAwesomeIcon icon={faArrowDown} className='arrowDown'/>
              </th>
              <th onClick={() => handleSort('totalAwaited')}>
                TOTAL AWAITED
                <FontAwesomeIcon icon={faArrowUp} className='arrowUp'/>
                <FontAwesomeIcon icon={faArrowDown} className='arrowDown'/>
              </th>
            </tr>
            {loading && (
              <div className="loading-overlay">
                <FontAwesomeIcon icon={faSpinner} spin size="5x" />
              </div>
             )}
          </thead>
          {!loading && (
          <tbody>
          {filterData().map((data, index) => (
              <tr key={index}>
                <td>{data.userName}</td>
                <td>{data.summaryDate}</td>
                <td>{data.totalRequest}</td>
                <td>{data.totalRejected}</td>
                <td>{data.totalSubmit}</td>
                <td>{data.totalDelivered}</td>
                <td>{data.totalFailed}</td>
                <td>{data.totalAwaited}</td>
              </tr>
            ))}
           {summaryReportData.length > 0 && (
            <tr className="total-count">
              <td></td>
              <td>Total</td>
              <td>{calculateColumnTotal('totalRequest')}</td>
              <td>{calculateColumnTotal('totalRejected')}</td>
              <td>{calculateColumnTotal('totalSubmit')}</td>
              <td>{calculateColumnTotal('totalDelivered')}</td>
              <td>{calculateColumnTotal('totalFailed')}</td>
              <td>{calculateColumnTotal('totalAwaited')}</td>
            </tr>
          )}
          </tbody>
          )}
        </table>
        </div>
    </div>
  )
}

export default UserSummaryReport