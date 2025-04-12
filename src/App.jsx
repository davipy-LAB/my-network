import './App.css'

function App() {
  return (
    <div className="App">
      <h1>My Network</h1>
      <p>The local that you can trust</p>
      <div className='container-create'>
        <h2>Create Account</h2>
        <form>
          <div className='container-input'>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className='container-input'>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className='container-buttons'>
          <button type="submit">Create</button>
          <button type="submit">I already have an account</button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default App;
// import { useState } from 'react'

