import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from "../ThemeProvider";

type Props = {
  children: React.ReactNode;
};

export const TestProviders = ({ children }: Props) => {
  return (
    <ThemeProvider>
        {children}
    </ThemeProvider>
  );
};

export function renderWithProviders(ui: ReactElement, options = {}) {
  return render(ui, { wrapper: TestProviders, ...options });
}