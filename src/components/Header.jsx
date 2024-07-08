import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export default function Header({ children }) {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  return (
    <>
      <div id="main-header-loading">
        {fetching > 0 || mutating > 0 ? <progress /> : null}
      </div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
