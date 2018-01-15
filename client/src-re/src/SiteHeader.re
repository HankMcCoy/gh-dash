let str = ReasonReact.stringToElement;

type state = {
  orgs: list(string)
};

type action =
  | LoadOrgs(list(string));

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

let make = (_children) => {
  ...component,
  initialState: () => {
    orgs: []
  },
  reducer: (action, _state) => {
    switch (action) {
    | LoadOrgs(orgs) => ReasonReact.Update({orgs: orgs})
    }
  },
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
  render: ({ state }) =>
    <div className=Styles.root>
      <label className=Styles.label>
        (str("Org"))
        <Spacer width="5px" />
        <select>
          (state.orgs
            |> List.map((org) =>
              (<option>(str(org))</option>))
            |> Array.of_list
            |> ReasonReact.arrayToElement)
        </select>
      </label>
      <Spacer width="10px" />
      <label className=Styles.label>
        (str("Repo"))
        <Spacer width="5px" />
        <select>
          (state.orgs
            |> List.map((org) =>
              (<option>(str(org))</option>))
            |> Array.of_list
            |> ReasonReact.arrayToElement)
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
