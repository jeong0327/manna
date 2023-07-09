import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './OrderForm.css';

function OrderForm() {
  const [packageTotal, setPackageTotal] = useState(() => {
    const savedPackageTotal = localStorage.getItem('packageTotal');
    return savedPackageTotal ? parseInt(savedPackageTotal, 10) : 0;
  });

  const [hallTotal, setHallTotal] = useState(() => {
    const savedHallTotal = localStorage.getItem('hallTotal');
    return savedHallTotal ? parseInt(savedHallTotal, 10) : 0;
  });

  const [orderType, setOrderType] = useState(() => {
    const savedOrderType = localStorage.getItem('orderType');
    return savedOrderType || '홀';
  });

  const [name, setName] = useState(() => {
    const savedName = localStorage.getItem('name');
    return savedName || '';
  });

  const [tableNumber, setTableNumber] = useState(() => {
    const savedTableNumber = localStorage.getItem('tableNumber');
    return savedTableNumber || '';
  });

  const [numberOfPeople, setNumberOfPeople] = useState(() => {
    const savedNumberOfPeople = localStorage.getItem('numberOfPeople');
    return savedNumberOfPeople || '';
  });

  const [money, setMoney] = useState(() => {
    const savedMoney = localStorage.getItem('money');
    return savedMoney || '';
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [completedOrders, setCompletedOrders] = useState(() => {
    const savedCompletedOrders = localStorage.getItem('completedOrders');
    return savedCompletedOrders ? JSON.parse(savedCompletedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('packageTotal', packageTotal.toString());
  }, [packageTotal]);

  useEffect(() => {
    localStorage.setItem('hallTotal', hallTotal.toString());
  }, [hallTotal]);

  useEffect(() => {
    localStorage.setItem('orderType', orderType);
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('tableNumber', tableNumber);
  }, [tableNumber]);

  useEffect(() => {
    localStorage.setItem('numberOfPeople', numberOfPeople);
  }, [numberOfPeople]);

  useEffect(() => {
    localStorage.setItem('money', money);
  }, [money]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
  }, [completedOrders]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedNumberOfPeople = parseInt(numberOfPeople, 10);
    if (isNaN(parsedNumberOfPeople) || parsedNumberOfPeople < 1) {
      alert('인원수는 1 이상의 수를 입력하세요');
      return;
    }

    const newOrder = {
      orderType: orderType,
      name: name,
      tableNumber: tableNumber,
      numberOfPeople: numberOfPeople,
      money: money
    };

    setOrders([...orders, newOrder]);
    setOrderType('홀');
    setName('');
    setTableNumber('');
    setNumberOfPeople('');
    setMoney('');

    if (orderType === '포장') {
      setPackageTotal((prevPackageTotal) => prevPackageTotal + parsedNumberOfPeople);
    } else if (orderType === '홀') {
      setHallTotal((prevHallTotal) => prevHallTotal + parsedNumberOfPeople);
    }
  };

  const handleCompleted = (index, order) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);

    if (order.orderType === '포장') {
      setPackageTotal((prevPackageTotal) => prevPackageTotal - order.numberOfPeople);
    } else if (order.orderType === '홀') {
      setHallTotal((prevHallTotal) => prevHallTotal - order.numberOfPeople);
    }

    setCompletedOrders([...completedOrders, order]);

    const checkbox = document.getElementById(`checkbox-${index}`);
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  const handleReset = () => {
    setPackageTotal(0);
    setHallTotal(0);
    setOrderType('홀');
    setName('');
    setTableNumber('');
    setNumberOfPeople('');
    setMoney('');
    setOrders([]);
    setCompletedOrders([]);
    localStorage.clear();
  };

  const saveAsExcel = () => {
    const workbook = XLSX.utils.book_new();
    const completedOrdersWorksheet = XLSX.utils.json_to_sheet(completedOrders);
    XLSX.utils.book_append_sheet(workbook, completedOrdersWorksheet, '만나 주문');
    const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(excelData)], { type: 'application/octet-stream' });

    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `만나_${year}${month}${day}.xlsx`;
    link.click();
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  return (
    <div>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='question'>
            <label>
              홀/포장
              <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="홀">홀 주문</option>
                <option value="포장">포장 주문</option>
              </select>
            </label>
          </div>
          <div className='question'>
            <label>
              이름
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>   
          <div className='question'>
            <label>
              장소
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </label>
          </div>    
          <div className='question'>
          </div>
          <div className='question'>
            <label>
              인원수
              <input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
              />
            </label>
          </div>
          <div className='question'>
            <label>
              금액
              <input
                type="number"
                value={money}
                onChange={(e) => setMoney(e.target.value)}
              />
            </label>
          </div>     
          <button type="submit">주문</button>
        </form>
      </div>

      <button onClick={handleReset}>모든 데이터 초기화</button>
      <button onClick={saveAsExcel}>엑셀 파일로 저장</button>  

      <div className='order-status'>
        <p className='order-type'>포장: {packageTotal}</p>
        <p className='order-type'>홀: {hallTotal}</p>
      </div>

      {orders.length > 0 && (
        <table>
          <caption>주문 정보</caption>
          <thead>
            <tr>
              <th>포장 / 홀</th>
              <th>이름</th>
              <th>장소</th>
              <th>인원수</th>
              <th>금액</th>
              <th>완료</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.orderType}</td>
                <td>{order.name}</td>
                <td>{order.tableNumber}</td>
                <td>{order.numberOfPeople}</td>
                <td>{order.money}</td>
                <td>
                  <input
                    id={`checkbox-${index}`}
                    type="checkbox"
                    onChange={() => handleCompleted(index, order)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {completedOrders.length > 0 && (
        <table>
          <caption>완료된 주문</caption>
          <thead>
            <tr>
              <th>홀/포장</th>
              <th>이름</th>
              <th>장소</th>
              <th>인원수</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            {completedOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.orderType}</td>
                <td>{order.name}</td>
                <td>{order.tableNumber}</td>
                <td>{order.numberOfPeople}</td>
                <td>{order.money}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderForm;
