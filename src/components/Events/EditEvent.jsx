import { Link, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, queryClient, updateEvent } from '../../util/http.ts';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { error, data, isError, isPending } = useQuery({
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    staleTime: 10000, // this making sure that the cached data is used without refetching it behind the scenes is the data is less than 10 seconds old
    queryKey: ['events', id],
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    mutationKey: ['update-event'],
    onSuccess() {
      navigate('../');
    },
    async onMutate(data) {
      await queryClient.cancelQueries({ queryKey: ['events', id] });
      const previousEvent = queryClient.getQueriesData(['events', id]);
      queryClient.setQueriesData(['events', id], data.event);
      return { previousEvent };
    },
    onError(error, data, context) {
      queryClient.setQueriesData(['events', id], context.previousEvent);
    },
    onSettled() {
      queryClient.invalidateQueries(['events', id]);
    },
  });

  function handleSubmit(formData) {
    mutate({ id: id, event: formData });
  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      {isPending ? (
        <LoadingIndicator />
      ) : isError ? (
        <ErrorBlock
          message={'sth went wrong'}
          title={error.info?.message || 'aaa'}
        />
      ) : (
        <EventForm inputData={data} onSubmit={handleSubmit}>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Update
          </button>
        </EventForm>
      )}
    </Modal>
  );
}
