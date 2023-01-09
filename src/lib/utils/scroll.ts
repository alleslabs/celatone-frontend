export const scrollTop = () => {
  document.getElementById("content")?.scroll(0, 0);
};

export const scrollToComponent = (componentId: string) => {
  document.getElementById(componentId)?.scrollIntoView();
};
