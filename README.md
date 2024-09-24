step 1:- create database


-- SQL Script to Create Tables in the 'teamsconnect' Database

-- 1. chat Table
CREATE TABLE chat (
    id INT NOT NULL AUTO_INCREMENT,
    members JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    type ENUM('one-to-one', 'group') DEFAULT 'one-to-one',
    PRIMARY KEY (id)
);

-- 2. files Table
CREATE TABLE files (
    id INT NOT NULL AUTO_INCREMENT,
    chatId INT NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    fileType VARCHAR(50),
    uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (chatId) REFERENCES chat(id)
);


-- 3. messages Table
CREATE TABLE messages (
    id INT NOT NULL AUTO_INCREMENT,
    chatId INT NOT NULL,
    senderId VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (chatId) REFERENCES chat(id)
);

-- 4. organizations Table
CREATE TABLE organizations (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    number_of_groups INT DEFAULT 0,
    number_of_users INT DEFAULT 0,
    PRIMARY KEY (id)
);



-- 5. users Table
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    organization_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- 6.user_info
CREATE TABLE user_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    phone_no VARCHAR(15),
    country_code VARCHAR(5),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    dob DATE,
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. grouptable Table
CREATE TABLE grouptable (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    organizationId INT,
    description VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

-- 8. user_groups Table
CREATE TABLE user_groups (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES grouptable(id)
);


-- 9. group_messages Table
CREATE TABLE group_messages (
    id INT NOT NULL AUTO_INCREMENT,
    groupId INT NOT NULL,
    messageId INT NOT NULL,
    chatId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (groupId) REFERENCES grouptable(id),
    FOREIGN KEY (messageId) REFERENCES messages(id),
    FOREIGN KEY (chatId) REFERENCES chat(id)
);

CREATE TABLE meeting_messages (
    id INT NOT NULL AUTO_INCREMENT,
    meeting_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);


CREATE TABLE meetings (
    id INT NOT NULL AUTO_INCREMENT,
    meeting_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);



Step 2 : create 3 terminals


(      make sure you are in correct directory  you may have to do cd 11Sep first    )
(              please install node modules            )


step 3 cd client
          npm run dev

step 4 cd server
         npm start

step 5 cd socket
          npm run socket        
