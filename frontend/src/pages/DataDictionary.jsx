import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../styles/DataDictionary.css"

function DataDictionary() {
  const { connection_id } = useParams();
  const [dataDictionary, setDataDictionary] = useState([]);

  useEffect(() => {
    // Assuming you have a list of tables from somewhere or another API call
    const fetchAttributes = async (tableName) => {
      try {
        const response = await api.get(
          `/catalog/attributes/${connection_id}/${tableName}`
        );
        if (response.data.attributes) {
          return { tableName, attributes: response.data.attributes };
        }
      } catch (error) {
        console.error(`Error fetching attributes for ${tableName}:`, error);
        return { tableName, attributes: [], error: true };
      }
    };

    const fetchDataDictionary = async () => {
      // Placeholder for fetching table names if needed
      const tables = await api.get(`/catalog/tables/${connection_id}`);
      const promises = tables.data.tables.map((table) =>
        fetchAttributes(table.table_name)
      );
      const results = await Promise.all(promises);
      setDataDictionary(results);
    };

    fetchDataDictionary();
  }, [connection_id]);

  return (
    <div className="data-dictionary">
      <h1>Data Dictionary</h1>
      {dataDictionary.map((table, index) => (
        <div key={index} className="table-container">
          <h2 className="table-name">{table.tableName}</h2>
          <table className="attributes-table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Data Type</th>
                <th>Primary Key</th>
                <th>Foreign Key</th>
              </tr>
            </thead>
            <tbody>
              {table.attributes.map((attr, idx) => (
                <tr key={idx}>
                  <td>{attr.column_name}</td>
                  <td>{attr.data_type}</td>
                  <td>{attr.is_primary_key ? "Yes" : "No"}</td>
                  <td>{attr.is_foreign_key ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default DataDictionary;
