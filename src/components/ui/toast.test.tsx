import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toaster } from './toast';
import { Provider } from 'react-redux';
import { configureAppStore } from '../../store';

describe('Toast Component', () => {
  it('should render Toaster correctly without crashing', () => {
    const store = configureAppStore();
    const { container } = render(
      <Provider store={store}>
        <Toaster />
      </Provider>
    );
    expect(container).toBeDefined();
  });

  it('should render Toaster correctly without Redux Provider context', () => {
    const { container } = render(<Toaster />);
    expect(container).toBeDefined();
  });
});
