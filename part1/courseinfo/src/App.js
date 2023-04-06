const Header = (props) => {
  return (
    <h1>
      This is {props.course}!
    </h1>
  )
}

const Part = (props) => {
  console.log(props)
  return(
    <>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </>
  )
}

const Content = (props) => {
  console.log(props)

  return (
    <div>
      <Part part={props.parts[0]}/>
      <Part part={props.parts[1]}/>
      <Part part={props.parts[2]}/>
    </div>
  )
}

const Total = (props) => {
  const exerTotal = (arr) => (
    arr.reduce((acc, cur) => cur.exercises + acc, 0)
  )

  return (
    <div>
      <p>
        Number of exercises {exerTotal(props.parts)}
      </p>
    </div>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default App;
