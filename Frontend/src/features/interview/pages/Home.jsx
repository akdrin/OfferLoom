import React from "react";
import "../styles/home.scss"


const Home= ()=> {
    return (
        <main className="home">
            <div className="interview-input-group">
            <div className="left">
                <label htmlFor="jobDescription">Job Description</label>
                <textarea name="jobDescription" id="jobDescription" placeholder="Enter Job Description"></textarea>
            </div>
            <div className="right">
                <div className="input-group">
                    <p>Resume <small  className="highlight">(Use resume and self Description for best results)</small></p>
                    <label className="file-label" htmlFor="resume">Upload Resume</label>
                    <input  hidden type="file" name="resume" id="resume" accept=".pdf" />
                </div>
                <div className="input-group">
                    <label htmlFor="selfDescription">Self Description</label>
                    <textarea name="selfDescription" id="selfDescription" placeholder="Describe Yourself"></textarea>
                </div>
                <button className="button primary-button">Generate Report</button>
            </div>
            </div>
        </main>
    )
}

export default Home