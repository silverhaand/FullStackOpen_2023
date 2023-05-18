import Notification from './Notification'

const LoginForm = ({
  notification,
  handleLogin,
  username,
  setUsername,
  password,
  setPassword
}) => (
  <>
    <h1>login to application</h1>
    <Notification notification={notification} className={'error'} />
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          id='username'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          id='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit' id='login-button'>login</button>
    </form>
  </>
)

export default LoginForm