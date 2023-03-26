@gentype
let truncate = (~text="", ~h=6, ~t=6, ()) => {
  let head = Js.String.slice(~from=0, ~to_=h, text)
  let tail = Js.String.sliceToEnd(~from=-1 * t, text)
  Js.String.length(text) > h + t ? Js.Array.joinWith("...", [head, tail]) : text
}
