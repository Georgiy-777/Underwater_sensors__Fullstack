CREATE TABLE sensor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    positionX FLOAT NOT NULL,
    positionY FLOAT NOT NULL,
    positionZ FLOAT NOT NULL,
	initialPositionX FLOAT NOT NULL,
    initialPositionY FLOAT NOT NULL,
    initialPositionZ FLOAT NOT NULL,
    waterSpeedX FLOAT NOT NULL,
    waterSpeedY FLOAT NOT NULL,
    waterSpeedZ FLOAT NOT NULL,
    thrusterSpeedX FLOAT NOT NULL,
    thrusterSpeedY FLOAT NOT NULL,
    thrusterSpeedZ FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    lost BOOLEAN DEFAULT FALSE
);