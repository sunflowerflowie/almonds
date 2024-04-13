import { useState, useEffect, } from "react";
import api from "../api";
import ConnectionForm from "../components/ConnectionForm";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";


function Connection() {
  const [forms, setForms] = useState([]);
  const [database_name, setDatabaseName] = useState("");
  const [hostname, setHostname] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  let navigate = useNavigate();

  // Navigate to the data catalog page and pass the connection_id
  function handleShowTables(connection_id) {
    navigate(`/catalog/tables/${connection_id}`);
  }

  useEffect(() => {
    getConnection();
  }, []);

  useEffect(() => {
    api
      .get("/connection/platforms/") 
      .then((response) => {
        setPlatforms(response.data);
        if (response.data.length > 0) {
          setSelectedPlatform(response.data[0].platform_id); 
        }
      })
      .catch((error) => console.error("Error fetching platforms:", error));
  }, []);

  // Get Connection Form
  const getConnection = () => {
    api
      .get("/connection/forms/")
      .then((rest) => rest.data)
      .then((data) => {
        console.log("Form loaded", data); //
        data.forEach(form => console.log(form)); //
        setForms(data);
      })
      .catch((err) => alert(err));
  };

  // Delete Connection Form
  const deleteConnection = (connection_id) => {
    console.log("Deleting connection with ID:", connection_id);
    api
      .delete(`/connection/forms/delete/${connection_id}/`)
      .then((res) => {
        if (res.status === 204) alert("Connection deleted!");
        else alert("Failed to delete note.");
        getConnection(); // Update screen
      })
      .catch((error) => alert(error));
  };

  // Create Connection Form
  const createConnection = (e) => {
    e.preventDefault();
    api
      .post("/connection/forms/", {
        database_name,
        hostname,
        port,
        username,
        password,
        description,
        platform: selectedPlatform,
      })
      .then((res) => {
        if (res.status === 201) alert("Connection Created!");
        else alert("Failed to make connection.");
        getConnection();
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <div>
        <h2>Connection Forms</h2>
        {forms.map((form) => (
          <ConnectionForm
            form={form}
            onDelete={() => deleteConnection(form.connection_id)} //{deleteConnection}
            onCatalog={() => handleShowTables(form.connection_id)}
            key={form.connection_id}
          />
        ))}
      </div>
      <h2>Fill Form</h2>
      <form onSubmit={createConnection}>
        <label htmlFor="platform">Platform:</label>
        <select
          id="platform"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          required
        >
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.platform_name}{" "}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="platform">Database Name:</label>
        <input
          type="text"
          id="database_name"
          name="database_name"
          required
          onChange={(e) => setDatabaseName(e.target.value)}
          value={database_name}
        />
        <br />
        <label htmlFor="hostname">Hostname:</label>
        <br />
        <input
          type="text"
          id="hostname"
          name="hostname"
          required
          onChange={(e) => setHostname(e.target.value)}
          value={hostname}
        />
        <br />
        <label htmlFor="port">Port:</label>
        <br />
        <input
          type="number"
          id="port"
          name="port"
          required
          onChange={(e) => setPort(parseInt(e.target.value, 10))} //setPort(e.target.value)}
          value={port}
        />
        <label htmlFor="username">Username:</label>
        <br />
        <input
          type="text"
          id="username"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label htmlFor="password">Password:</label>
        <br />
        <input
          type="text"
          id="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <label htmlFor="description">Description</label>
        <br />
        <textarea
          id="description"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default Connection;
