import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.ts';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const navigator = useNavigate();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isPending: isPendingDeleteEvent,
    // isLoading: isLoadingDeleteEvent,
    isError: isErrorDeleteEvent,
    error: errorDeleteEvent,
  } = useMutation({
    mutationFn: () => deleteEvent({ id }),
    mutationKey: [],
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',
      });
      navigator('/events');
    },
  });

  function deleteEventHandler() {
    mutate();
  }
  const formattedDate = new Date(data?.date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  console.log(formattedDate);
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isLoading ? (
        <LoadingIndicator />
      ) : isError ? (
        <ErrorBlock
          title={'failed to load the event!'}
          message={error.message}
        />
      ) : (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={deleteEventHandler}>
                {isPendingDeleteEvent ? 'Deleteing...' : 'Delete'}
              </button>
              {isErrorDeleteEvent ? (
                <ErrorBlock
                  title={'An Error Occoured!'}
                  message={errorDeleteEvent.message}
                />
              ) : null}
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt="" />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time
                  dateTime={`Todo-DateT$Todo-Time`}
                >{`${formattedDate} @ ${data.time}`}</time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
