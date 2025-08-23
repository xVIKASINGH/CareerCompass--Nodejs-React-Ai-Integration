CREATE TABLE PUBLIC.users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL

)

CREATE TABLE PUBLIC.FEEDBACK(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES PUBLIC.users(id),
    resume_url TEXT,
    score INTEGER NOT NULL MIN CHECK (score >= 1 AND score <= 100),
    comment TEXT,
    job_description TEXT,
    summary TEXT,
    skill_gap TEXT,
    suggestions TEXT,
    strength TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


  // summary    // skills gap     // suggestions    // strength