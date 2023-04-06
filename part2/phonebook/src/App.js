import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ inputHandler }) => {
  return (
    <div>
      filter shown with <input onChange={inputHandler} />
    </div>
  )
}

const PersonForm = ({ submitEvent, nameChange, numChange }) => {
  return (
    <form onSubmit={submitEvent}>
      <div>name: <input onChange={nameChange} /></div>
      <div>number: <input onChange={numChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const NameNumber = ({ person, deleteHandler }) => {
  return (
    <p>{person.name} {person.number}
      <button onClick={deleteHandler}>delete</button>
    </p>
  )
}

const Persons = ({ filteredNames, setPersons }) => {
  const confirmDelete = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletePerson(id)
      const updatedPersons = filteredNames.filter(person =>
        person.id !== id
      )
      setPersons(updatedPersons)
    }
  }
  return (
    <>
      {filteredNames.map(person => {
        return <NameNumber key={person.id} person={person}
          deleteHandler={() => confirmDelete(person.name, person.id)} />
      }
      )}
    </>
  )
}

const Notification = ({ message }) => {
  if (message === null) return null;

  const successNotif = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const errorNotif = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const selectedNotif = message.includes('Added') ?
    successNotif : errorNotif

  return (
    <div style={selectedNotif}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhoneNum, setNewPhoneNum] = useState('');
  const [searchedName, setSearchedName] = useState('');
  const [notification, setNotification] = useState(null);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumChange = (event) => setNewPhoneNum(event.target.value);
  const filterByName = (event) => setSearchedName(event.target.value);

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
  }, []);

  const filtered = persons.filter(person =>
    person.name.toLowerCase().includes(searchedName.toLowerCase())
  );

  const addPerson = (event) => {
    event.preventDefault();
    const personObj = {
      name: newName,
      number: newPhoneNum,
    };
    const doesNameExist = persons.some(person =>
      person.name.toLowerCase() === personObj.name.toLowerCase());
    const getPerson = persons.find(person =>
      person.name.toLowerCase() === newName.toLowerCase());

    if (doesNameExist) {
      if (window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(getPerson.id, personObj)
          .then(returnedPerson =>
            setPersons(persons.map(person =>
              person.id !== getPerson.id ? person : returnedPerson))
          )
          .catch(error => {
            setNotification(`Information of ${newName} has already been removed from server`)
            setTimeout(() => setNotification(null), 5000)
          })
      }
    } else {
      personService
        .create(personObj)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => setNotification(null), 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter inputHandler={filterByName} />

      <h3>add a new</h3>
      <PersonForm
        submitEvent={addPerson}
        nameChange={handleNameChange}
        numChange={handleNumChange}
      />

      <h2>Numbers</h2>
      <Persons
        filteredNames={filtered}
        setPersons={setPersons} />
    </div>
  )
}

export default App