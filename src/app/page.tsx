"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dietPreference: "None",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/requisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age, 10),
          dietPreference: formData.dietPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // Save to local browser storage as a mock database
      const existingDb = JSON.parse(localStorage.getItem("mock_db") || "[]");
      existingDb.push({
        id: Date.now(),
        name: formData.name,
        age: formData.age,
        diet_preference: formData.dietPreference,
        created_at: new Date().toISOString()
      });
      localStorage.setItem("mock_db", JSON.stringify(existingDb));

      setStatus("success");
      setMessage("Your requisition has been successfully submitted!");
      setFormData({ name: "", age: "", dietPreference: "None" });
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1>Diet Requisition</h1>
        <p>Please provide your details below.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name (max 50 chars)</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            maxLength={50}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            className="form-control"
            value={formData.age}
            onChange={handleChange}
            min={1}
            max={120}
            required
            placeholder="30"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dietPreference">Diet Preference</label>
          <select
            id="dietPreference"
            name="dietPreference"
            className="form-control"
            value={formData.dietPreference}
            onChange={handleChange}
            required
          >
            <option value="None">None</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
            <option value="Pescatarian">Pescatarian</option>
            <option value="Halal">Halal</option>
            <option value="Kosher">Kosher</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" className="btn-submit" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Submit Requisition"}
        </button>
      </form>

      {status === "success" && <div className="message success">{message}</div>}
      {status === "error" && <div className="message error">{message}</div>}
    </main>
  );
}
