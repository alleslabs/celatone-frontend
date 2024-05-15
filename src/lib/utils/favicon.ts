export const changeFavicon = (newHref: string) => {
  const documentHead =
    document.head || document.getElementsByTagName("head")[0];

  const newFavicon = document.createElement("link");
  newFavicon.id = "favicon";
  newFavicon.rel = "shortcut icon";
  newFavicon.href = newHref;

  const oldFavicon = document.getElementById("favicon");
  if (oldFavicon) {
    documentHead.removeChild(oldFavicon);
  }
  documentHead.appendChild(newFavicon);
};
