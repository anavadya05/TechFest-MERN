import { useEffect, useState } from "react";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/registrations/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRegistrations(data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <h2>My Registrations</h2>

      {registrations.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        registrations.map((registration) => (
          <div className="registration-card" key={registration._id}>
            <h3>{registration.event.name}</h3>

            <p>
              <strong>Category:</strong>{" "}
              {registration.event.category}
            </p>

            <p>
              <strong>Fee:</strong> ₹{registration.event.fee}
            </p>

            <p>
              <strong>Event Date:</strong>{" "}
              {new Date(registration.event.date).toLocaleDateString()}
            </p>

            <p>
              <strong>Registration Date:</strong>{" "}
              {new Date(
                registration.registeredAt
              ).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRegistrations;


