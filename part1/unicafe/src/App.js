import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Stats = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  if (all === 0) {
    return (
      <h3>No feedback given</h3>
    )
  }
  return (
    <table>
      <tbody>
        <StatsLine text='good' value={good} />
        <StatsLine text='neutral' value={neutral} />
        <StatsLine text='bad' value={bad} />
        <StatsLine text='all' value={all} />
        <StatsLine text='average' 
          value={((good - bad) / all).toFixed(1)} />
        <StatsLine text='positive' symbol='%'
          value={((good / all) * 100).toFixed(1)} />
      </tbody>
    </table>
  )
}

const StatsLine = ({ text, value, symbol = '' }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
      <td>{symbol}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const setToValue = (val, func) => () => func(val)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={setToValue(good + 1, setGood)}
        text='good' />
      <Button handleClick={setToValue(neutral + 1, setNeutral)}
        text='neutral' />
      <Button handleClick={setToValue(bad + 1, setBad)}
        text='bad' />
      <h1>statistics</h1>
      <Stats good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App