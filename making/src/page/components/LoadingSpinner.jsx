import React from 'react';
import '../style/spinner.scss';

export default function LoadingSpinner() {
  return (
    <div className='spinner-container'>
      <div className='loading-spinner'></div>
      <strong style={{ color: '#fff' }}>
        Mohon Tunggu Proses Sedang Berlangsung!
      </strong>
    </div>
  );
}
