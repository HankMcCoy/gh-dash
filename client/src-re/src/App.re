let str = ReasonReact.stringToElement;
let component = ReasonReact.statelessComponent("App");

let make = (_children) => {
  ...component,
  render: (_self) =>
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
      <SiteHeader />
    </div>
};
