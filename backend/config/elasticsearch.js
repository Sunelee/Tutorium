const { Client } = require('@elastic/elasticsearch');
const { ELASTICSEARCH_URL } = process.env;

const client = new Client({ node: ELASTICSEARCH_URL });

module.exports = client;
