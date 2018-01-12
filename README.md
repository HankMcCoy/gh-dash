# Description

This is a WIP tool for querying GH data, without having an Enterprise installation.

# Setup 

- Create a [new personal access token](https://github.com/settings/tokens) for this tool
- Add `export GH_TOKEN='<PERSONAL_ACCESS_TOKEN>'` to your `.bashrc`
- Populate the data by running `npm run populate:bc && npm run populate:client` (this may take a looong time)
- In three separate windows run:
  - `npm run start:db`
  - `npm run start:server`
  - `npm run start:client`
- Go to [localhost:3000](http://localhost:3000/) and voila!

# TODO

- [x] Get a chunk of PRs loaded into Mongo
- [x] Switch the client to React
- [x] Add chart for average review time by week
	- [x] Add endpoint for getting the data
	- [x] Add a graph in the client to display the data
- [x] Retrieve _all_ PRs with paged fetches, with smart rate limit handling
- [x] Add reviewing leaderboard
	- [x] Add endpoint for getting the data
	- [x] Add a table in the client to display the data
