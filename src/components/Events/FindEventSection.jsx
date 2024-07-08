import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchForEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';
export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();

  const { error, data, isError, isLoading } = useQuery({
    queryFn: () => searchForEvents(searchTerm),
    queryKey: ['events', { search: searchTerm }],
    enabled: searchTerm !== undefined
  });
  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {isLoading ? (
        <LoadingIndicator />
      ) : isError ? (
        <ErrorBlock message={error.message} title={'An Error Happend'} />
      ) : data ? (
        <ul className="events-list">
          {data.map((e) => (
            <li key={e.id}>
              <EventItem event={e} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Please enter a search term and to find events.</p>
      )}
    </section>
  );
}
