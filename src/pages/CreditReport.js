import React, {useState, useEffect} from 'react'
import './CreditReport.css';
import Endpoints from '../endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowUp, faArrowDown, faBackward ,faForward } from '@fortawesome/free-solid-svg-icons';

function CreditReport() {
   
  const [creditReportData, setCreditReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const [sortOrder, setSortOrder] = useState({ column: 'userName', ascending: true });


  useEffect(() => {
    console.log("Effect is running");
    const fetchData = async () => {
      try {
        const response = await fetch(Endpoints.get('availableCredit'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authJwtToken')}`,
          },
          body: JSON.stringify({
            loggedInUserName: localStorage.getItem('loggedInUser'),
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error fetching data. Server response: ${errorMessage}`);
        }
    
        const data = await response.json();
        setCreditReportData(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []); 

 // Pagination Code
 const indexOfLastRow = currentPage * rowsPerPage;
 const indexOfFirstRow = indexOfLastRow - rowsPerPage;

 // Filter Search for Available Credit Table
 const filteredData = creditReportData.filter((data) =>
   data.userName.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

 // Logic for displaying page numbers
 const pageNumbers = [];
 for (let i = currentPage; i <= currentPage + 2; i++) {
   if (i <= Math.ceil(filteredData.length / rowsPerPage)) {
     pageNumbers.push(i);
   }
 }

  // Function to handle sorting
 const handleSort = (columnName) => {
  setSortOrder((prevSortOrder) => {
    // If clicking on the same column, toggle the sorting order
    const ascending = prevSortOrder.column === columnName ? !prevSortOrder.ascending : true;

    // Perform sorting
    const sortedData = creditReportData.slice().sort((a, b) => {
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
    setCreditReportData(sortedData);

    return { column: columnName, ascending };
  });
};


  return (
    <div className="credit-report-container">
        <h2>Credit Report</h2>
        <hr/>
        <div>
        <div className="credit-search-container">
        <input
          type="text"
          id="search"
          name="search"
          placeholder='Search'
          className="credit-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         {/* <button type="button" ><FontAwesomeIcon icon={faDownload} /></button> */}
      </div>
      <div className="credit-table-container">
          {loading ? (
             <div className="loading-overlay">
             <FontAwesomeIcon icon={faSpinner} spin size="5x" />
           </div> 
          ) : (
            <>
            <table className="credit-table">
              <thead>
                <tr>
                  {/* <th>USER NAME</th> */}
                  <th onClick={() => handleSort('userName')}>
                USER NAME
                <FontAwesomeIcon icon={faArrowUp} className='arrowUpCredit' />
                <FontAwesomeIcon icon={faArrowDown} className='arrowDownCredit' />
              </th>
                  {/* <th>AVAILABLE CREDIT</th> */}
                  <th onClick={() => handleSort('availableCredit')}>
                  AVAILABLE CREDIT
                <FontAwesomeIcon icon={faArrowUp} className='arrowUpCredit' />
                <FontAwesomeIcon icon={faArrowDown} className='arrowDownCredit' />
              </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((data, index) => (
                  <tr key={index}>
                    <td>{data.userName}</td>
                    <td>{data.availableCredit || '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
            {currentPage > 1 && (
                <span onClick={() => setCurrentPage(currentPage - 1)}> <FontAwesomeIcon icon={faBackward}  className='backwardIcon'/></span>
              )}
              {pageNumbers.map((number) => (
                <span
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={currentPage === number ? 'active' : ''}
                >
                  {number}
                </span>
              ))}
              {currentPage + 2 < Math.ceil(creditReportData.length / rowsPerPage) && (
                <span onClick={() => setCurrentPage(currentPage + 1)}> <FontAwesomeIcon icon={faForward} className='forwardIcon'/></span>
              )}
            </div>
          </>
          )}
        </div>
        </div>
    </div>
  )
}

export default CreditReport