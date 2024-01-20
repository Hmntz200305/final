import React from 'react'

const Regis = () => {
    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Regis page :)</h2>
                </div>
            </div>
            <div class="flex justify-center items-center min-h-screen">
                <div class="glass p-8 max-w-md w-full">
                    <div class="form-header mb-4 pb-4">
                        <h1 class="text-center"><b>LOGIN</b></h1>
                    </div>
                    <form class="form-reg" method="POST" action="/loginproses">
                        <div class="row-reg">
                            <h2><b>Username</b></h2>
                            <div class="input-container">
                                <i class="fas fa-envelope icon"></i>
                                <input type="email" id="username" name="username" placeholder="Masukkan email" required />
                            </div>
                        </div>
                        <div class="row-reg">
                            <h2><b>Email</b></h2>
                            <div class="input-container">
                                <i class="fas fa-envelope icon"></i>
                                <input type="email" id="email" name="email" placeholder="Masukkan email" required />
                            </div>
                        </div>
                        <div class="row-reg">
                            <h2><b>Password</b></h2>
                            <div class="input-container">
                                <i class="fas fa-lock icon"></i>
                                <input type="password" id="password" name="password" placeholder="Masukkan password" required />
                            </div>
                        </div>
                        <button href="index.html" class="btn w-full h-13 my-2">Registrasi</button>
                        <div class="flex justify-center my-1">
                            <a href="/" class="text-black underline">Back</a>
                        </div>
                    </form>
                    <div id="message"></div>
                </div>
            </div>
        </>
    )
}
export default Regis