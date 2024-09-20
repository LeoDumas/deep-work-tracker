import React, { useState } from 'react';
import { CreateSession } from '../../wailsjs/go/main/App.js';

function CreateSessionComponent() {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Call the CreateSession method from the Go backend
        CreateSession(startTime, endTime, description)
            .then(() => {
                setMessage('Session created successfully!');
                // Clear the form
                setStartTime('');
                setEndTime('');
                setDescription('');
            })
            .catch((err) => {
                console.error("Failed to create session:", err);
                setMessage('Failed to create session.');
            });
    };

    return (
        <div>
            <h2>Create a New Deep Work Session</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Start Time:</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>End Time:</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Session</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateSessionComponent;
