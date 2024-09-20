import React, { useEffect, useState } from "react";
import { GetAllSessions } from "../wailsjs/go/main/App.js";
import NewSession from "./components/NewSession.tsx";

type Session = {
  id: number;
  StartTime: string;
  EndTime: string;
  Description: string;
};

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Fetch all sessions when the component mounts
    GetAllSessions()
      .then((result: Session[]) => {
        setSessions(result);
      })
      .catch((err) => {
        console.error("Failed to retrieve sessions:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white grid place-items-center mx-auto py-8">
      <div className="text-blue-900 text-2xl font-bold flex flex-col items-center space-y-4">
        <h1>Deep Work Sessions</h1>
        {sessions.map((session) => (
          <div key={session.id} className="p-4 border-b border-gray-200">
            <p><strong>Start:</strong> {session.StartTime}</p>
            <p><strong>End:</strong> {session.EndTime}</p>
            <p><strong>Description:</strong> {session.Description}</p>
          </div>
        ))}
      </div>
      <NewSession />
    </div>
  );
}

export default App;
