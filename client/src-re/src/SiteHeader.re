let str = ReasonReact.stringToElement;
type state = {
  orgs: list(string),
  repos: list(string)
};

type action =
  | LoadOrgs(list(string))
  | LoadRepos(list(string));

let component = ReasonReact.reducerComponent("SiteHeader");

module Styles {
  open Glamor;

  let root = css([
    display("flex"),
    backgroundColor("#F2F2F2"),
    border("1px solid #ddd"),
    height("50px"),
    alignItems("center"),
    padding("0 20px")
  ]);

  let label = css([
    display("flex")
  ])
};

let make = (~setOrg, ~setRepo, _children) => {
  ...component,
  initialState: () => {
    orgs: [],
    repos: [],
  },
  reducer: (action, state) => {
    switch (action) {
    | LoadOrgs(orgs) => ReasonReact.Update({...state, orgs: orgs})
    | LoadRepos(repos) => ReasonReact.Update({...state, repos: repos})
    }
  },
  didMount: (self) => {
    Js.Promise.({
      OrgData.fetchAll()
      |> then_((orgs) => {
        self.send(LoadOrgs(orgs));
        resolve()
      })
      |> ignore;

      RepoData.fetchAll()
      |> then_((repos) => {
        self.send(LoadRepos(repos));
        resolve()
      })
      |> ignore;
    });
    ReasonReact.NoUpdate;
  },
  render: ({ state }) =>
    <div className=Styles.root>
      <label className=Styles.label>
        (str("Org"))
        <Spacer width="5px" />
        <select
          onChange={(event) => setOrg(Util.getTarget(event)##value)}
        >
          <option></option>
          (state.orgs
            |> List.map((org) =>
              (<option>(str(org))</option>))
            |> Util.listToElement)
        </select>
      </label>
      <Spacer width="10px" />
      <label className=Styles.label>
        (str("Repo"))
        <Spacer width="5px" />
        <select
          onChange={(event) => setRepo(Util.getTarget(event)##value)}
        >
          <option></option>
          (state.repos
            |> List.map((repo) =>
              (<option>(str(repo))</option>))
            |> Util.listToElement)
        </select>
      </label>
      <Spacer width="10px" />
      <label className=Styles.label>
        (str("Time-span"))
        <Spacer width="5px" />
        <select>
          <option></option>
          <option>(str("1 week"))</option>
          <option>(str("2 week"))</option>
          <option>(str("4 week"))</option>
          <option>(str("8 week"))</option>
          <option>(str("16 week"))</option>
        </select>
      </label>
    </div>
};
