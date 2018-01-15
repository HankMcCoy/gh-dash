type state = {
  orgs: list(string),
  repos: list(string)
};

type action =
  | LoadOrgs(list(string));

let component = ReasonReact.reducerComponentWithRetainedProps("Page");

let make = (_children) => {
  ...component,
  initialState: () => {
    orgs: [],
    repos: []
  },
  reducer: (action, state) => {
    switch (action) {
    | LoadOrgs(orgs) => ReasonReact.update({...state, orgs})
    }
  },
  retainedProps: (),
  didMount: (self) => {
    Js.Promise.(
      OrgData.fetchAll()
      |> then_((orgs) => {
        self.send(LoadOrgs(orgs));
        resolve()
      })
      |> ignore
    );
    ReasonReact.NoUpdate;
  },
  render: (_self) =>
    <div>
      (ReasonReact.stringToElement("Hello you!"))
    </div>
};
