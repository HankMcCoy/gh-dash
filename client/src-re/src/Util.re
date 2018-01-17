let listToElement = (list) => list
|> Array.of_list
|> ReasonReact.arrayToElement;

let getTarget = (event) => ReactDOMRe.domElementToObj(ReactEventRe.Synthetic.target(event))
