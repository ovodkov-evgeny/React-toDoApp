import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {

  maxId = 100;

  state = {
    items: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch')
    ],
    filter: 'all',
    search: ''
  };

  createTodoItem (label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  };

  deleteItem = (id) => {
    this.setState(({ items }) => {
      const index = items.findIndex(el => el.id === id);

      const newArr = [
        ...items.slice(0, index),
        ...items.slice(index + 1),
      ];

      return {
        items: newArr,
      };
    });
  };

  addItem = (text) => {
    
    const newItem = this.createTodoItem(text);

    this.setState(({items}) => {
      
      const newArr = [
        ...items, newItem
      ];

      return {
        items: newArr
      }
    });
  };
  
  toggleProperty (arr, id, propName) {
    const index = arr.findIndex(el => el.id === id);
    const oldItem = arr[index];
    const item = {...oldItem, [propName]: !oldItem[propName]}

    return [
      ...arr.slice(0, index),
      item,
      ...arr.slice(index + 1),
    ];
  }

  onToggleImportant = (id) => {
    this.setState(({ items }) => {
      return {
        items: this.toggleProperty(items, id, 'important')
      };
    });
  };

  onToggleDone = (id) => {
    this.setState(({ items }) => {
      return {
        items: this.toggleProperty(items, id, 'done')
      };
    });
  };

  onFilterChange = (filter) => {
    this.setState({ filter });
  };

  onSearchChange = (search) => {
    this.setState({ search });
  };

  filterItems(items, filter) {
    if (filter === 'all') {
      return items;
    } else if (filter === 'active') {
      return items.filter((item) => (!item.done));
    } else if (filter === 'done') {
      return items.filter((item) => item.done);
    }
  }

  searchItems(items, search) {
    if (search.length === 0) {
      return items;
    }

    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });
  }

  render() {

    const { items, filter, search } = this.state;
    const doneCount = items.filter((item) => item.done).length;
    const toDoCount = items.length - doneCount;
    const visibleItems = this.searchItems(this.filterItems(items, filter), search);

    return (
      <div className="todo-app">
        <AppHeader toDo={ toDoCount } done={ doneCount } />
        
        <div className="search-panel d-flex">
          <SearchPanel onSearchChange={this.onSearchChange} />
          <ItemStatusFilter filter={filter} onFilterChange={this.onFilterChange} />
        </div>

        <TodoList 
          todos={visibleItems}
          onDeleted={this.deleteItem}
          onToggleDone={this.onToggleDone}
          onToggleImportant={this.onToggleImportant} />

        <ItemAddForm  onItemAdded = {this.addItem}/>
      </div>
    );
  }
}
