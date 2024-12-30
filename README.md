# Football Team Search Application

This project is a web application designed to search and display football team information for the top 6 leagues in Europe. The application consists of a **front-end** and a **back-end**:

- **Front-end**: Built using React to provide a user-friendly interface.
- **Back-end**: Powered by Node.js and Elasticsearch to perform efficient searches and manage data.

---

## Features

### Front-end (React Application)
- **Search Functionality**: Users can search for football teams based on keywords.
- **Pagination**: Results are displayed with pagination for better usability.
- **Team Details**: Clicking a team displays detailed information, including league, squad size, foreign players, and more.
- **Responsive Design**: Ensures a smooth user experience across devices.

### Back-end (Node.js and Elasticsearch)
- **Elasticsearch Integration**: Efficient data handling and search queries.
- **Synonym Processing**: Supports common synonyms (e.g., "EPL" resolves to "Premier League").
- **Robust Querying**: Handles numerical and textual queries effectively.
- **Secure Connection**: Utilizes TLS for secure communication with Elasticsearch.

---

## Installation and Setup

### Prerequisites
- **Node.js**: To run the back-end and front-end servers.
- **Elasticsearch**: For storing and querying football team data.
- **Kibana**: To manage Elasticsearch and create visualizations.

### Front-end
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
    ```bash
   npm install
### Back-end
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
3. Start the back-end server:
   ```bash
   node Api.js
   
### Installing Elasticsearch and Kibana
1. Download and install **Elasticsearch** and **Kibana** from the [Elastic website](https://www.elastic.co/downloads/).
2. Start Elasticsearch:
   ```bash
   bin/elasticsearch
3. Start Kibana:
   ```bash
   bin/kibana
4.Navigate to `http://localhost:9200` (Elasticsearch) and `http://localhost:5601` (Kibana) to confirm the services are running.
