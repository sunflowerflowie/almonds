import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function DataCatalog() {
  const [tables, setTables] = useState([]);
  const { connection_id } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
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

  // Function to navigate using useNavigate
  const navigateToDataDictionary = () => {
    navigate(`/data-dictionary/${connection_id}`);
  };

  return (
    <div>
      <h1>Tables in Database</h1>
      <button onClick={navigateToDataDictionary}>View Data Dictionary</button>
      <ul>
        {tables.map((table, index) => (
          <li key={index}>{table.table_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataCatalog;
