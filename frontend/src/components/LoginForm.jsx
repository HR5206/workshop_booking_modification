import React, { useState } from 'react';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { username, password });
    }


    return (
        <div className="login-container">
            <div className="login-card">
                <h2>FOSEE Workshop Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlfor="username">Username</label>
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.targetvalue)}
                          placeholder="Enter your username"
                          required
                          />
                    </div>
                    <div className="form-group">
                        <label htmlfor="password">Password</label>
                        <input
                          id="password"
                          type=
                        >
                        </input>
                    </div>
                </form>
            </div>
        </div>
    );
}