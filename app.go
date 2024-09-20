package main

import (
	"context"
	"fmt"
  "database/sql"
  "log"
	_ "github.com/mattn/go-sqlite3"
)

// App struct
type App struct {
	ctx context.Context
  db *sql.DB
}

// Sessions struct
type Session struct {
  ID          int
  StartTime   string
  EndTime     string
  Description string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx

  // Load database
  var err error
  a.db, err = sql.Open("sqlite3", "./deepwork.db")
  if err != nil {
    log.Fatal(err)
  }

  // Create table if not existing
	sqlStmt := `
	CREATE TABLE IF NOT EXISTS sessions (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		start_time DATETIME,
		end_time DATETIME,
		description TEXT
	);
	`

  _, err = a.db.Exec(sqlStmt)
  if err != nil{
    log.Fatalf("%q: %s\n", err, sqlStmt)
  }
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
  // Close db when app close
  if a.db != nil{
    a.db.Close()
  }
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Get all work Sessions
func (a *App) GetAllSessions() ([]Session, error) {
	rows, err := a.db.Query("SELECT id, start_time, end_time, description FROM sessions")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []Session
	for rows.Next() {
		var session Session
		err := rows.Scan(&session.ID, &session.StartTime, &session.EndTime, &session.Description)
		if err != nil {
			return nil, err
		}
		sessions = append(sessions, session)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sessions, nil
}

// Add deep work sessions
func (a *App) CreateSession(startTime, endTime, description string) error{
  _, err := a.db.Exec("INSERT INTO sessions (start_time, end_time, description) VALUES (?,?,?)", startTime, endTime, description)
  return err
}

