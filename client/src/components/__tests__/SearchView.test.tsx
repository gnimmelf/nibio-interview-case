import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { renderWithProviders } from './TestProviders';
import { SearchView } from '../SearchView';

// Mock the API module
vi.mock('src/api/apis', () => ({
  getStreets: vi.fn().mockResolvedValue({
    streets: [
      {
        countryCode: 'no',
        city: 'Oslo',
        streetName: 'Storgata',
        streetIds: [1],
      },
    ],
    totalResults: 1,
  }),
}));

describe('SearchView', () => {
  it('renders with correct label text', () => {
    renderWithProviders(<SearchView />);
    expect(screen.getByText('Skriv inn et gatenavn')).toBeInTheDocument();
  });

  it('has a search button', () => {
    renderWithProviders(<SearchView />);
    expect(screen.getByRole('button', { name: 'Søk' })).toBeInTheDocument();
  });

  it('handles text input and search button interaction', () => {
    renderWithProviders(<SearchView />);

    // Fill text input
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Storgata' } });

    // Press search button
    const searchButton = screen.getByRole('button', { name: 'Søk' });
    fireEvent.click(searchButton);

    // Check search button is disabled
    expect(searchButton).toBeDisabled();

    // Check cancel button is enabled
    expect(screen.getByRole('button', { name: 'Nullstill' })).not.toBeDisabled();

    // Check spinner is showing
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays async fetch result after search', async () => {
    renderWithProviders(<SearchView />);

    // Fill text input
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Nøkkefaret' } });

    // Press search button
    const searchButton = screen.getByRole('button', { name: 'Søk' });
    fireEvent.click(searchButton);

    // Wait for async fetch to resolve and check result
    await waitFor(() => {
      expect(screen.getByText('Nøkkefaret')).toBeInTheDocument();
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});