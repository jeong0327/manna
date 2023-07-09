import React from 'react';
import OrderForm from './OrderForm';

function App() {
  const h1_style = {
    fontSize: 40,
    textAlign: 'center',
  }

  return (
    <div>
      <h1 style={h1_style}>🍙 만나 주문 🍙</h1>
      <OrderForm />
    </div>
  );
}

export default App;
