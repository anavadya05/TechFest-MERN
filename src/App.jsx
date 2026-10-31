import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./pages/login";
import Register from "./pages/register";
import MyRegistrations from "./pages/myregistrations";

const API_URL = import.meta.env.VITE_API_URL;

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const registerEvent = async (eventId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(`${API_URL}/api/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId: eventId,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully");

      setEvents(
        events.map((event) =>
          event._id === eventId ? { ...event, seats: event.seats - 1 } : event,
        ),
      );
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="container">
      <div className="welcome">
        <h2>Welcome to TechFest 2026</h2>
        <p>Explore exciting technical events and register to participate.</p>
      </div>
      <h2>Upcoming Events</h2>

      <div className="events">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <h3>{event.name}</h3>

            <p>
              <strong>Category:</strong> {event.category}
            </p>

            <p>
              <strong>Fee:</strong> ₹{event.fee}
            </p>

            <p>
              <strong>Seats Available:</strong> {event.seats}
            </p>

            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>

            <button
              onClick={() => registerEvent(event._id)}
              disabled={event.seats === 0}
            >
              {event.seats === 0 ? "No Seats Available" : "Register Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setLoggedIn(false);
    setUserName(null);
    alert("Logged out");
  };
  const handleLogin = () => {
    setLoggedIn(true);
    setUserName(localStorage.getItem("userName"));
  };
  return (
    <BrowserRouter>
      {" "}
      <header>
        {" "}
        <h1>TechFest 2026</h1>{" "}
        <nav>
          {" "}
          <Link to="/">Events</Link>{" "}
          {!loggedIn && (
            <>
              {" "}
              <Link to="/register">Register</Link>{" "}
              <Link to="/login">Login</Link>{" "}
            </>
          )}{" "}
          {loggedIn && (
            <>
              {" "}
              <Link to="/my-registrations"> My Registrations </Link>{" "}
              <span className="welcome-user"> Welcome, {userName} 👋 </span>{" "}
              <button onClick={logout}> Logout </button>{" "}
            </>
          )}{" "}
        </nav>{" "}
      </header>{" "}
      <Routes>
        {" "}
        <Route path="/" element={<Events />} />{" "}
        <Route path="/register" element={<Register />} />{" "}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />{" "}
        <Route path="/my-registrations" element={<MyRegistrations />} />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;
