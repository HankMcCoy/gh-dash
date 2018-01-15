let component = ReasonReact.statelessComponent("Spacer");

let make = (~width="", ~height="", _children) => {
  ...component,
  render: (_self) =>
    <div style=(
      ReactDOMRe.Style.make(~width=width, ~height=height, ())
    ) />
};
