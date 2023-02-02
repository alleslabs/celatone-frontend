export const scrollToTop = () => {
  document.getElementById("content")?.scroll(0, 0);
};

export const scrollToComponent = (componentId: string) => {
  document.getElementById(componentId)?.scrollIntoView();
};

export const scrollYPosition = () => {
  return document.getElementById("content")?.scrollTop;
};
