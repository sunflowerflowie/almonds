import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/DataCatalog.css";  
function DataCatalog() {
  const [tables, setTables] = useState([]);
  const { connection_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const connectionDetails = location.state?.form;

  useEffect(() => {
    if (!connectionDetails) {
      console.log("No connection details provided, navigating to home.");
      navigate('/'); 
    }
    
    api.get(`/catalog/tables/${connection_id}`)
      .then((res) => {
        if (res.data.tables) {
          setTables(res.data.tables);
        } else {
          console.error("Error fetching tables:", res.data.error);
        }
      })
      .catch((error) => console.error("Error fetching tables:", error));
  }, [connection_id]);

  const navigateToDataDictionary = () => {
    navigate(`/data-dictionary/${connection_id}`);
  };

  return (
    <div className="data-catalog-container">
      <div>
        <Navbar />
      </div>
      <div className="content-container"></div>
      <header className="catalog-header">
        <h1>{connectionDetails?.database_name}</h1>
        <div className="connection-details">
          <p><strong>Hostname:</strong> {connectionDetails?.hostname}</p>
          <p><strong>Port:</strong> {connectionDetails?.port}</p>
          <p><strong>Platform:</strong> {connectionDetails?.platform_name}</p>
          <p><strong>Role:</strong> {connectionDetails?.role_name}</p>
          <p><strong>Department:</strong> {connectionDetails?.department_name}</p>
          <p><strong>Description:</strong> {connectionDetails?.description}</p>
        </div>
        <button onClick={navigateToDataDictionary} className="data-dictionary-button">
          View Data Dictionary
        </button>
      </header>
      <br />
      <h1>Tables:</h1>
      <section className="table-list">
        <ul>
          {tables.map((table, index) => (
            <li key={index}>{table.table_name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default DataCatalog;
