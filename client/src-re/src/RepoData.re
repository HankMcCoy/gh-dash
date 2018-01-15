type repo_list = {
	repos: list(string)
};

let parse_repo_list = (json): repo_list =>
	Json.Decode.{
		repos: json |> field("repos", list(string))
	};

let fetchAll = () =>
	Js.Promise.(
		Fetch.fetch("http://localhost:3000/api/repos")
		|> then_(Fetch.Response.json)
		|> then_((json) => resolve(parse_repo_list(json)))
		|> then_((repo_list) => resolve(repo_list.repos))
	);
