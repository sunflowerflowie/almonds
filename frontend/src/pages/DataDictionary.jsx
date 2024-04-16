import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/DataDictionary.css";
import jsPDF from "jspdf";

function DataDictionary() {
  const { connection_id } = useParams();
  const [dataDictionary, setDataDictionary] = useState([]);

  useEffect(() => {
    const fetchDataDictionary = async () => {
      const tablesResponse = await api.get(`/catalog/tables/${connection_id}`);
      const promises = tablesResponse.data.tables.map((table) =>
        api
          .get(`/catalog/attributes/${connection_id}/${table.table_name}`)
          .then((response) => ({
            tableName: table.table_name,
            attributes: response.data.attributes || [],
            error: !response.data.attributes,
          }))
      );
      const results = await Promise.all(promises);
      setDataDictionary(results);
    };

    fetchDataDictionary();
  }, [connection_id]);

  // Function to generate and download PDF
  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(document.querySelector(".data-dictionary"), {
      callback: function (pdf) {
        pdf.save("data-catalog.pdf");
      },
      x: 10,
      y: 10,
      width: 595.28,
      windowWidth: document.documentElement.offsetWidth,
    });
  };

  return (
    <div className="data-dictionary">
      <Navbar />
      <div className="content-container">
        <h1>Data Dictionary</h1>
        <div className="data-dictionary-button-container">
          <button onClick={generatePDF} className="data-dictionary-button">
            Export as PDF
          </button>
        </div>
        {dataDictionary.map((table, index) => (
          <div key={index} className="table-container">
            <h2>{table.tableName}</h2>
            <table>
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
    </div>
  );

}

export default DataDictionary;
