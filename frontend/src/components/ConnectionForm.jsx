import React from "react";
import "../styles/Note.css"


function ConnectionForm({ form, onDelete }) {
  //const formattedDate = new Date(form.created_at).toLocaleDateString("en-US");
  console.log("Form ID:", form.connection_id);

  return (
    <div>
      <p className="database_name">{form.database_name}</p>
      <p className="hostname">{form.hostname}</p>
      <p className="port">{form.port}</p>
      <p className="username">{form.username}</p>
      <p className="password">{form.password}</p>
      <p className="description">{form.description}</p>
      <p className="platform">{form.platform}</p>
      <p className="connection-platform">{form.platform_name}</p>
      <button className="delete-button" onClick={() => onDelete(form.connection_id)}>
        Delete
      </button>
    </div>
  );
}

export default ConnectionForm;
