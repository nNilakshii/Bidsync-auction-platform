import { useEffect, useState, type FormEvent } from 'react';
import type { PlaceBidPayload } from '../api/types';

interface BidFormProps {
  currentPrice: number;
  disabled?: boolean;
  onSubmit: (payload: PlaceBidPayload) => Promise<void> | void;
}

export function BidForm({ currentPrice, disabled = false, onSubmit }: BidFormProps) {
  const [amount, setAmount] = useState(currentPrice + 1);
  const [bidderDisplayName, setBidderDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    setAmount(Number((currentPrice + 1).toFixed(2)));
  }, [currentPrice]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({ amount, bidderDisplayName });
      setBidderDisplayName('');
      setAmount(currentPrice + 1);
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Failed to place bid';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="bid-form" onSubmit={handleSubmit}>
      <div className="bid-form__group">
        <label htmlFor="bid-amount">Amount</label>
        <input
          id="bid-amount"
          type="number"
          min={(currentPrice + 0.01).toFixed(2)}
          step="0.01"
          value={amount}
          onChange={event => setAmount(Number(event.target.value))}
          required
        />
      </div>

      <div className="bid-form__group">
        <label htmlFor="bidder-name">Display name</label>
        <input
          id="bidder-name"
          type="text"
          value={bidderDisplayName}
          onChange={event => setBidderDisplayName(event.target.value)}
          placeholder="Your name"
          required
        />
      </div>

      {error ? <p className="bid-form__error">{error}</p> : null}

      <button type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Place bid'}
      </button>
    </form>
  );
}
