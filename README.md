# Raiden Express Server

This is an Express Server that connects to a [Raiden](https://raiden-network.readthedocs.io/en/stable/overview_and_guide.html#introduction) Client.

## Get started
- Clone the repository
- run `npm install`
- Create a `.env` file and add `RAIDEN_CLIENT_URL=http://localhost:5001` (Replace `http://localhost:5001` with you Raiden client url)
- Ensure your Raiden client has whitelisted the url the server is running on (`http://localhost:3001`), or you'll get a `cors` error

