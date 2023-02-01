'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import EachOrder from './EachOrder';
import LoaderWave from './LoaderWave';
import { Order } from '../../models/tigris/orders';

const Home = () => {
  // This is the input field
  const [textInput, setTextInput] = useState('');

  // Todo list array which displays the todo orders
  const [ordersList, setTodoList] = useState<Order[]>([]);

  // Loading and Error flags for the template
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // This is use to animate the input text field
  const [wiggleError, setWiggleError] = useState(false);

  // Two separate views. 1. List view for todo orders & 2. Search result view
  type viewModeType = 'list' | 'search';
  const [viewMode, setViewMode] = useState<viewModeType>('list');

  // Fetch Todo List
  /*
   'fetchListOrders' is the first method that's called when the component is mounted from the useEffect below.
   This sets some of the state like 'isLoading' and 'isError' before it fetches for data from the endpoint defined under 'pages/api/orders/index'.
   The api endpoint returns a json with the key 'result' and a status 200 if successful or returns a status 500 along with the 'error' key.
   If the 'result' key is present we safely set the 'ordersList'.
  */
  const fetchListOrders = () => {
    setIsLoading(true);
    setIsError(false);

    fetch('/api/orders')
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.result) {
          setViewMode('list');
          setTodoList(data.result);
        } else {
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  // Load the initial list of todo-orders
  useEffect(() => {
    fetchListOrders();
  }, []);

  // Add a new todo-item
  /*
  'addOrderItem' takes the 'textInput' state, creates a 'Order' & converts it to a JSON.
  Sends it over as body payload to the api endpoint; which is how the api expects and is defined in 'pages/api/orders' 'POST' switch.
  */
  const addOrder = () => {
    if (queryCheckWiggle()) {
      return;
    }
    setIsLoading(true);

    fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ text: textInput, completed: false })
    }).then(() => {
      setIsLoading(false);
      setTextInput('');
      fetchListOrders();
    });
  };

  // Delete order
  /*
  'deleteOrder' requires an id value of the Order. When the user presses the 'delete'(cross) button from a Order, this method is invoked.
  It calls the endpoint 'api/item/<id>' with the 'DELETE' method. Read the method 'handleDelete' under pages/api/item/[id]' to learn more how the api handles deletion.
  */
  const deleteOrder = (id?: Order["id"]) => {
    setIsLoading(true);

    fetch('/api/item/' + id, {
      method: 'DELETE'
    }).then(() => {
      setIsLoading(false);
      if (viewMode == 'list') {
        fetchListOrders();
      } else {
        searchQuery();
      }
    });
  };

  // Update order (mark complete/incomplete)
  /*
  'updateOrder' takes the Order object, inverts the 'completed' boolean and calls the same endpoint as 'deletion' but with a different method 'PUT'.
  Navigate to 'api/item/[id]' and read more how the api handles updates under the 'handlePut' method.
  */
  const updateOrder = (item: Order) => {
    //item.completed = !item.completed;
    setIsLoading(true);

    fetch('/api/order/' + item.id, {
      method: 'PUT',
      body: JSON.stringify(item)
    }).then(() => {
      setIsLoading(false);
      if (viewMode == 'list') {
        fetchListOrders();
      } else {
        searchQuery();
      }
    });
  };

  // Search query
  /*
  'searchQuery' method takes the state from 'textInput' and send it over to the 'api/orders/search' endpoint via a query param 'q'.
  The response is the same as the response from "fetch('/api/orders')", an array of Orders if successful.
  */
  const searchQuery = () => {
    if (queryCheckWiggle()) {
      return;
    }
    setIsLoading(true);

    fetch(`/api/orders/search?q=${encodeURI(textInput)}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.result) {
          setViewMode('search');
          setTodoList(data.result);
        }
      });
  };

  // Util search query/input check
  /*
  The is a helper util method, that validates the input field via a regex and returns a true or false.
  This also wiggles the text input if the regex doesn't find any match.
  */
  const queryCheckWiggle = () => {
    const result: RegExpMatchArray | null = textInput.match('^\\S.{0,100}$');
    if (result === null) {
      setWiggleError(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!wiggleError) {
      return;
    }
    const timeOut = setTimeout(() => {
      setWiggleError(false);
    }, 500);

    return () => clearTimeout(timeOut);
  }, [wiggleError]);

  return (
    <div>
      <div className="container">
        <h2>Sample Todo app using Next.js 13 and Tigris</h2>

        {/* Search Header */}
        <div className="searchHeader">
          <input
            className={`searchInput ${wiggleError ? 'invalid' : ''}`}
            value={textInput}
            onChange={e => {
              setWiggleError(false);
              setTextInput(e.target.value);
            }}
            placeholder="Type an item to add or search"
          />
          <button onClick={addOrder}>Add</button>
          <button onClick={searchQuery}>Search</button>
        </div>

        {/* Results section */}
        <div className="results">
          {/* Loader, Errors and Back to List mode */}
          {isError && <p className="errorText">Something went wrong.. </p>}
          {isLoading && <LoaderWave />}
          {viewMode == 'search' && (
            <button
              className="clearSearch"
              onClick={() => {
                setTextInput('');
                fetchListOrders();
              }}
            >
              Go back to list
            </button>
          )}

          {/* Todo Item List */}
          {ordersList.length < 1 ? (
            <p className="noOrders">
              {viewMode == 'search' ? 'No orders found.. ' : 'Add an order by typing in the field above and hit Add!'}
            </p>
          ) : (
            <ul>
              {ordersList.map(each => {
                return (
                  <EachOrder
                    key={each.id}
                    order={each}
                    deleteHandler={deleteOrder}
                    updateHandler={updateOrder}
                  />
                );
              })}
            </ul>
          )}
        </div>
        <a href="https://tigrisdata.com/">
          <Image src="/tigris_logo.svg" alt="Tigris Logo" width={100} height={100} />
        </a>
      </div>
    </div>
  );
};

export default Home;
