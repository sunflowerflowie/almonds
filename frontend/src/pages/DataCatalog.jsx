import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import api from "../api";

function DataCatalog() {
  const [tables, setTables] = useState([]);
  const { connection_id } = useParams(); // Get the connection ID from the URL

  // useEffect(() => {
  //     api(`/catalog/tables/${connection_id}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         if (data.tables) {
  //           setTables(data.tables);
  //         } else {
  //           console.error('Error fetching tables:', data.error);
  //         }
  //       })
  //       .catch(error => console.error('Error fetching tables:', error));
  // }, [connection_id]);

  useEffect(() => {
    api
      .get(`/catalog/tables/${connection_id}`)
      .then((res) => {
        if (res.data.tables) {
          setTables(res.data.tables);
        } else {
          console.error("Error fetching tables:", res.data.error);
        }
      })
      .catch((error) => console.error("Error fetching tables:", error));
  }, [connection_id]);

  return (
    <div>
      <h1>Tables in Database</h1>
      <ul>
        {tables.map((table, index) => (
          <li key={index}>{table.table_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataCatalog;
