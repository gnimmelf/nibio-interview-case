import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import 'vitest-dom/extend-expect'

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
