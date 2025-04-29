import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const getTodosFromLocalStorage = () => {
  const storedTodos = localStorage.getItem('todos');
  try {
    return storedTodos ? JSON.parse(storedTodos) : [];
  } catch (error) {
    console.error("Error parsing todos from localStorage:", error);
    return [];
  }
};

const getThemeFromLocalStorage = () => {
  const storedTheme = localStorage.getItem('theme');
  return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
};

const Component1 = () => {
  const [todos, setTodos] = useState(getTodosFromLocalStorage());
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState(getThemeFromLocalStorage());

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      return;
    }
    const newTodo = {
      id: Date.now(),
      text: input.trim(),
    };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearTodos = () => {
    setTodos([]);
  };

  const handleThemeToggle = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className={`container mx-auto p-4`} style={{ minHeight: '100vh' }}>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">To-Do Application</CardTitle>
          <div className="flex items-center justify-end space-x-2">
            <Label htmlFor="theme-toggle">Dark Mode</Label>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTodo} className="flex mb-6 gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new todo..."
            />
            <Button type="submit">Add Todo</Button>
          </form>

          <Separator className="mb-4" />

          {todos.length > 0 ? (
            <ul className="space-y-2">
              {todos.map(todo => (
                <li key={todo.id} className="flex justify-between items-center p-3 border rounded-md bg-card text-card-foreground shadow-sm">
                  <span className="flex-grow mr-4">{todo.text}</span>
                  <Button
                    onClick={() => removeTodo(todo.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">Your todo list is empty!</p>
          )}
        </CardContent>
        {todos.length > 0 && (
          <CardFooter className="flex justify-center pt-4">
            <Button
              onClick={clearTodos}
              variant="outline"
            >
              Clear All Todos
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Component1;