import React, { useState } from 'react'

export default function Login() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
function handleSubmit(e){
  e.preventDefault()
}

return (
  <div className='auth-form-shell'>
    <form
    className='auth-form'
      onSubmit={handleSubmit}>
      <h2
      className='auth-form__title'>Вход</h2>
      <input
      className='auth-form__inputs'
        value={email || ""}
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
        required/>
      <input
      className='auth-form__inputs'
        value={password || ""}
        placeholder="Пароль"
        type="password"
        onChange={(e)=>setPassword(e.target.value)}
        required/>
      <button className='auth-form__btn buttonEffect'>Войти</button>
    </form>
  </div>
)
}
