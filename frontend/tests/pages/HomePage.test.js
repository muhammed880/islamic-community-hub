import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../src/pages/public/HomePage';

describe('HomePage Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  test('renders main heading', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Islamic Community Hub');
  });

  test('renders feature cards', () => {
    renderComponent();
    const featureSection = screen.getByText('Our Features');
    expect(featureSection).toBeInTheDocument();
  });

  test('renders explore and register buttons', () => {
    renderComponent();
    const exploreButton = screen.getByRole('link', { name: /explore masjids/i });
    const registerButton = screen.getByRole('link', { name: /get started/i });
    
    expect(exploreButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  test('displays statistics', () => {
    renderComponent();
    expect(screen.getByText(/5000\+/)).toBeInTheDocument();
    expect(screen.getByText(/masjids/i)).toBeInTheDocument();
  });
});
