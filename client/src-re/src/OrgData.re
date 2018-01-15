type org_list = {
	orgs: list(string)
};

let parse_org_list = (json): org_list =>
	Json.Decode.{
		orgs: json |> field("orgs", list(string))
	};

let fetchAll = () =>
	Js.Promise.(
		Fetch.fetch("http://localhost:3000/api/orgs")
		|> then_(Fetch.Response.json)
		|> then_((json) => resolve(parse_org_list(json)))
		|> then_((org_list) => resolve(org_list.orgs))
	);
