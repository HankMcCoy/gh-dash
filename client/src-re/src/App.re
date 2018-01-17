let str = ReasonReact.stringToElement;

type state = {
  org: option(string),
  repo: option(string)
};

type action =
| SetOrg(string)
| SetRepo(string);

let component = ReasonReact.reducerComponent("App");

let make = (_children) => {
  ...component,
  initialState: () => {
    org: None,
    repo: None
  },
  reducer: (action, state) => {
    switch (action) {
    | SetOrg(org) => ReasonReact.Update({...state, org: Some(org)})
    | SetRepo(repo) => ReasonReact.Update({...state, repo: Some(repo)})
    }
  },
  render: (self) =>
    <div>
      <style>
        (str({|
          body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
          }
        |}))
      </style>
      <SiteHeader
        setOrg={(org) => self.send(SetOrg(org))}
        setRepo={(repo) => self.send(SetRepo(repo))}
      />
      <div>
        (str("Org"))
        (switch (self.state.org) {
        | None => ReasonReact.nullElement
        | Some(org) => str(org)
        })
      </div>
      <div>
        (str("Repo"))
        (switch (self.state.repo) {
        | None => ReasonReact.nullElement
        | Some(repo) => str(repo)
        })
      </div>
    </div>
};
