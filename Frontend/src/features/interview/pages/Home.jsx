import React, { useState } from "react";
import "../style/home.scss";

const Home = () => {
  const [resumeName, setResumeName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
    }
  };

  return (
    <main className="home">
      <div className="interview-card">
        <header className="card-header">
          <h1>Interview Preparation</h1>
          <p>
            Provide your job description and resume to get a tailored interview
            report.
          </p>
        </header>

        <div className="interview-input-group">
          <div className="left">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              name="jobDescription"
              id="jobDescription"
              placeholder="Enter job description here..."
            ></textarea>
          </div>

          <div className="right">
            <div className="input-group">
              <p>
                Resume{" "}
                <small className="highlight">
                  (Use Resume and Self Description together for best results)
                </small>
              </p>
              <label className="file-label" htmlFor="resume">
                <span className="file-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </span>
                <span className="file-text">
                  {resumeName ? resumeName : "Click to upload resume"}
                </span>
                <span className="file-hint">PDF only</span>
              </label>
              <input
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="selfDescription">Self Description</label>
              <textarea
                name="selfDescription"
                id="selfDescription"
                placeholder="Describe yourself in a few sentences..."
              ></textarea>
            </div>
          </div>
        </div>

        <footer className="card-footer">
          <button className="button primary-button generate-btn">
            Generate Interview Report
          </button>
        </footer>
      </div>
    </main>
  );
};

export default Home;
