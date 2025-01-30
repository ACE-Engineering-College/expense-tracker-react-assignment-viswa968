import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.jsx';


// Test case 1: Adding an expense
test('should add an expense to the list and update total', async () => {
  render(<App />);

  const nameInput = screen.getByPlaceholderText('Expense Name');
  const amountInput = screen.getByPlaceholderText('Amount');
  const categoryInput = screen.getByRole('combobox');
  const dateInput = screen.getByPlaceholderText('Date');
  const addButton = screen.getByRole('button', { name: /add expense/i });

  fireEvent.change(nameInput, { target: { value: 'Lunch' } });
  fireEvent.change(amountInput, { target: { value: '20' } });
  fireEvent.change(categoryInput, { target: { value: 'Food' } });
  fireEvent.change(dateInput, { target: { value: '2025-01-19' } });
  fireEvent.click(addButton);

  await waitFor(() => {
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses: 20')).toBeInTheDocument();
  });
});

// Test case 2: Sorting expenses by amount (ascending)
test('should sort expenses by amount in ascending order', async () => {
  render(<App />);

  // Adding expenses with all required fields
  const addExpense = async (name, amount) => {
    fireEvent.change(screen.getByPlaceholderText('Expense Name'), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: amount } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: '2025-01-19' } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  };

  await addExpense('Lunch', '20');
  await addExpense('Coffee', '10');

  // Click sort button or header (depending on your implementation)
  const sortButton = screen.getByRole('button', { name: /sort by amount/i });
  fireEvent.click(sortButton);

  // Wait for the sorting to complete
  await waitFor(() => {
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Coffee');
    expect(rows[2]).toHaveTextContent('Lunch');
  });
});

// Test case 3: Deleting an expense
test('should delete an expense from the list', async () => {
  render(<App />);

  // Add an expense with all required fields
  fireEvent.change(screen.getByPlaceholderText('Expense Name'), { target: { value: 'Lunch' } });
  fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '20' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
  fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: '2025-01-19' } });
  fireEvent.click(screen.getByRole('button', { name: /add expense/i }));

  // Wait for the expense to be added
  await waitFor(() => {
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  const deleteButton = screen.getByRole('button', { name: /delete/i });
  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(screen.queryByText('Lunch')).not.toBeInTheDocument();
  });
});



// Test case 6: Date range filtering
test('should filter expenses by date range', async () => {
  render(<App />);

  // Add test expenses
  const addExpense = async (name, date) => {
    fireEvent.change(screen.getByPlaceholderText('Expense Name'), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '20' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: date } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  };

  await addExpense('Past Expense', '2024-01-19');
  await addExpense('Current Expense', '2025-01-19');
  await addExpense('Future Expense', '2026-01-19');

  // Click sort by date button
  const sortDateButton = screen.getByRole('button', { name: /sort by date/i });
  fireEvent.click(sortDateButton);

  // Check results are in date order
  await waitFor(() => {
    const expenses = screen.getAllByRole('row').slice(1); // Skip header row
    expect(expenses[0]).toHaveTextContent('Past Expense');
    expect(expenses[1]).toHaveTextContent('Current Expense');
    expect(expenses[2]).toHaveTextContent('Future Expense');
  });
});

// Test case 7: Total expenses calculation
test('should correctly calculate total expenses', async () => {
  render(<App />);

  // Add test expenses
  const addExpense = async (name, amount) => {
    const nameInput = screen.getByPlaceholderText('Expense Name');
    const amountInput = screen.getByPlaceholderText('Amount');
    const categoryInput = screen.getByLabelText(/category/i);
    const dateInput = screen.getByPlaceholderText('Date');

    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(amountInput, { target: { value: amount } });
    fireEvent.change(categoryInput, { target: { value: 'Food' } });
    fireEvent.change(dateInput, { target: { value: '2025-01-19' } });

    const addButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(addButton);
  };

  await addExpense('Expense 1', '20.50');
  await addExpense('Expense 2', '30.25');

  // Check total by finding the text content directly
  await waitFor(() => {
    const totalElement = screen.getByText(/total expenses: 50.75/i);
    expect(totalElement).toBeInTheDocument();
  });

  // Delete first expense
  const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
  fireEvent.click(deleteButton);

  // Check updated total
  await waitFor(() => {
    const totalElement = screen.getByText(/total expenses: 30.25/i);
    expect(totalElement).toBeInTheDocument();
  });
});
