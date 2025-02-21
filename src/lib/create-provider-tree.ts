import React, { PropsWithChildren } from "react";

export const createProviderTree = (providers: JSX.Element[]) => {
  return function ProviderTree(props: PropsWithChildren) {
    const lastIndex = providers.length - 1;
    let children = props.children;

    for (let i = lastIndex; i >= 0; i--) {
      const element = providers[i];
      children = React.cloneElement(element, undefined, children);
    }

    return children;
  };
};
