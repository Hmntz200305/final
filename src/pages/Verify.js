import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@material-tailwind/react'

const Verify = () => {
  const [token, setToken] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Ambil token dari URL saat komponen dimuat
    const pathTokens = location.pathname.split('/');
    const urlToken = pathTokens[pathTokens.length - 1];

    // Jika ada token dalam URL, atur ke state
    if (urlToken) {
      setToken(urlToken);
    }
  }, [location.pathname]);

  const handleVerify = async () => {
    try {
      // Kirim token ke backend untuk verifikasi
      const response = await fetch(`https://asset.lintasmediadanawa.com:8443/verifyemail/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Handle respons dari backend di sini, misalnya, tampilkan pesan sukses
        alert('Verifikasi berhasil! Anda dapat melanjutkan.');
      } else {
        // Handle kesalahan HTTP di sini
        console.error('Verifikasi gagal:', response.status, response.statusText);
        alert('Verifikasi gagal. Silakan coba lagi.');
      }
    } catch (error) {
      // Handle kesalahan selama pengiriman permintaan
      console.error('Error during verification:', error);
      alert('Terjadi kesalahan selama verifikasi. Silakan coba lagi.');
    }
  };

  return (
    <div>
      <h2>Verification Page</h2>
      <Button className='main-btn' onClick={handleVerify}>Verify</Button>
    </div>
  );
};

export default Verify;
