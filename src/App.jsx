import React from 'react'
import { useState, useEffect } from 'react'
import supabase from './helper/supabaseClient'
import './App.css'
const App = () => {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      console.log('Fetched tasks:', data)
      setTasks(data)
    }
  }

  async function addTask() {
    if (title.trim() === '') return
    const { data, error } = await supabase.from('tasks').insert([{ title, completed: false }]).select()
    if (error) {
      console.error('Error adding task:', error)
    } else {
      setTasks([...tasks, ...data])
      setTitle('')
      fetchTasks();
    }
  }

  async function completeTask(id) {
    await supabase.from('tasks').update({ completed: true }).eq('id', id)
    fetchTasks();
  }

  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks();
  }

  async function updateTask(id, newTitle) {
    await supabase.from('tasks').update({ title: newTitle }).eq('id', id)
    fetchTasks();
  }

  return (
    <div className='App'>
      <h1>Task Manager App</h1>
      <input className='input' type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Add new task' />
      <button className='Addbtn' onClick={addTask}>Add</button>

      <div className='tasks-container'>
        <div className='incomplete-tasks'>
          <h2>Incomplete tasks</h2>
          <div className='task-list'>
            {tasks.filter(task => !task.completed).map(task => (
              <div className='tasks' key={task.id}>
                <span>{task.title}</span>
                <div>
                  <button onClick={() => completeTask(task.id)}>completed</button>
                  <button onClick={() => updateTask(task.id, prompt("new title:", task.title))}>update</button>
                  <button onClick={() => deleteTask(task.id)}>delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='completed-tasks'>
          <h2>Completed tasks</h2>
          <div className='task-list'>
            {tasks.filter(task => task.completed).map(task => (
              <div className='tasks' key={task.id}>
                <span>{task.title}</span>
                <div>
                  <button onClick={() => deleteTask(task.id)}>delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App