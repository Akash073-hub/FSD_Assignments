import { useState } from "react";
import "./App.css";

function App() {

  // useState stores the values entered in the form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [gender, setGender] = useState("");
  const [terms, setTerms] = useState(false);

  // Stores error messages
  const [error, setError] = useState("");

  // Controls the toast message
  const [showToast, setShowToast] = useState(false);


  // Event handling for form submission
  const handleSubmit = (e) => {

    e.preventDefault();

    // IF condition
    if (name === "") {
      setError("Please enter your name");
      return;
    }

    if (email === "") {
      setError("Please enter your email");
      return;
    }

    if (phone === "") {
      setError("Please enter your phone number");
      return;
    }

    if (course === "") {
      setError("Please select a course");
      return;
    }

    if (gender === "") {
      setError("Please select your gender");
      return;
    }

    if (!terms) {
      setError("Please accept the terms and conditions");
      return;
    }

    // If everything is correct
    setError("");

    // Show toast
    setShowToast(true);

    // Store/display submitted values in console
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Course:", course);
    console.log("Gender:", gender);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };


  // Reset form
  const handleReset = () => {

    setName("");
    setEmail("");
    setPhone("");
    setCourse("");
    setGender("");
    setTerms(false);
    setError("");
    setShowToast(false);

  };


  return (
    <div className="app">

      <div className="form-container">

        <h1>Student Registration</h1>

        <p className="subtitle">
          Fill in your details to register
        </p>


        <form onSubmit={handleSubmit}>

          {/* Name */}

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>


          {/* Phone */}

          <div className="form-group">

            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter 10 digit number"
              maxLength="10"
              value={phone}
              onChange={(e) => {

                const value = e.target.value;

                // IF condition inside event handling
                if (/^\d*$/.test(value)) {
                  setPhone(value);
                }

              }}
            />

          </div>


          {/* Course */}

          <div className="form-group">

            <label>Course</label>

            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >

              <option value="">
                Select Course
              </option>

              <option value="BCA">
                BCA
              </option>

              <option value="B.Tech">
                B.Tech
              </option>

              <option value="MCA">
                MCA
              </option>

              <option value="MBA">
                MBA
              </option>

            </select>

          </div>


          {/* Gender */}

          <div className="form-group">

            <label>Gender</label>

            <div className="radio-group">

              <label>
                <input
                  type="radio"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>


              <label>
                <input
                  type="radio"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>

            </div>

          </div>


          {/* Terms */}

          <div className="terms">

            <label>

              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />

              I agree to the terms and conditions

            </label>

          </div>


          {/* Error */}

          {error && (
            <p className="error">
              {error}
            </p>
          )}


          {/* Buttons */}

          <div className="buttons">

            <button
              type="submit"
              className="register-btn"
            >
              Register
            </button>

            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </form>

      </div>


      {/* Toast */}

      {showToast && (
        <div className="toast">
          ✓ Registration successful!
        </div>
      )}

    </div>
  );
}

export default App;