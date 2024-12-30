const { Client } = require('@elastic/elasticsearch');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5555;

// Elasticsearch connection details
const certificateBase64 = `d7448a0718d07dc74cabbaa617cef048f6e5cff51bd588a112110007787a4a12`;
const uname = 'elastic';
const passwrd = 'hfoh1dSq_2T5xa=XSaua';

// Decode the base64 certificate
const certBuffer = Buffer.from(certificateBase64, 'base64');

// Configure Elasticsearch client
const client = new Client({
  node: 'https://localhost:9200', // Elasticsearch node URL
  auth: {
    username: uname,
    password: passwrd,
  },
  tls: {
    ca: certBuffer,
    rejectUnauthorized: false,
    insecure: true
  }
});

// Test Elasticsearch connection
client.ping({}, (err, response) => {
  if (err) {
    console.error('Failed to connect to Elasticsearch:', err);
  } else {
    console.log('Connected to Elasticsearch:', response);
  }
});

// Enable CORS for frontend
app.use(cors({ origin: 'http://localhost:3000' }));

// API endpoint to handle search requests
app.get('/api/search', async (req, res) => {
  const { query, foreigners } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Query string is required' });
  }

  console.log('Search Query:', query); // Log the query parameter for debugging
  
  // Apply synonyms before sending to Elasticsearch
  const synonyms = {
    "england": "Premier League",
    "epl" : "Premier League",
    "spain": "LaLiga",
    "laliga": "LaLiga",
    "germany": "Bundesliga",
    "bundes": "Bundesliga",
    "italy": "Serie A",
    "france": "Laegue 1",
    "protugal": "Liga Portugal",
    "ten hag": "Manchester United",
    "7-0": "Manchester United",
    "msn": "FC Barcelona",
    "barca": "FC Barcelona",
    "redbull": "RB Leipzig",
    "man city": "Manchester City"
  };

  const processedQuery = synonyms[query.toLowerCase()] || query
  const blankquery = "0"

  console.log('Processed Query:', processedQuery); // Log the processed query for debugging
  const isNumeric = !isNaN(processedQuery) && !isNaN(parseFloat(processedQuery));
  console.log("Is numeric: ", isNumeric);

  const shouldClauses = [
    {
      match: {
        Club_name: {
          query: processedQuery,
          operator: "or",
          boost: 5
        }
      }
    },
    {
      match: {
        Description: {
          query: query,
          operator: "or",
          boost: isNumeric ? 0 : (synonyms[query.toLowerCase()] ? 0 : 1)
        }
      }
    },
    {
      match: {
        League: {
          query: processedQuery,
          operator: "or",
          boost: 4
        }
      }
    },
    {
      match:{
        Squad:{
          query: isNumeric ? query : blankquery,
          operator: "or",
          boost: 3
        }
      }
    },
    {
      match:{
        Foreigners:{
          query: isNumeric ? query : blankquery,
          operator: "or",
          boost: 3
        }
      }
    }
  ];
  
  try {
    const result = await client.search({
      index: 'football_team_index',
      body: {
        query: {
          function_score: {
            query: {
              bool: {
                should: shouldClauses,
                minimum_should_match: 1
              }
            },
            functions: [
              {
                field_value_factor: {
                  field: ["Squad","Foreigners"],
                  factor: 2,
                  modifier: "log1p",
                  missing: 1
                },
                filter: {
                  term: {
                    League: query,
                  }
                },
                weight: 2
              }
            ],
            boost_mode: "sum",  
            score_mode: "max"
          }
        },
        size: 114
      }
    });
    

    console.log(result.hits)
    // Transform Elasticsearch response data
    const data = result.hits.hits.map((item) => ({
      club: item._source.Club_name,
      league: item._source.League || 'Not Provided',
      squad: parseInt(item._source.Squad, 10),
      foreigners: parseInt(item._source.Foreigners, 10),
      age: parseFloat(item._source.age),
      marketValue: item._source['market value'],
      totalMarketValue: item._source['Total market value'],
      description: item._source.Description,
      logo: item._source.logo,
      url: item._source.url,
    }));
  
    res.status(200).json({
      totalResults: result.hits.total.value,
      data,
    });
  } catch (error) {
    console.error('Elasticsearch query error:', error);
    res.status(500).json({
      message: 'Error querying Elasticsearch',
      error: error.message
    });
  }
});

// Start Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
