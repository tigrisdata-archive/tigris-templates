'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
{{- $dbname := .ProjectName -}}
{{with .Collection}}
import { {{.Name}} } from '../../models/tigris/{{.JSON}}';
import Each from './each';
import LoaderWave from '../components/LoaderWave';
import Menu from '../components/Menu';
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/core";
const Home = () => {
  // This is the input field
  const [textInput, setTextInput] = useState('');

  // List array which displays the {{.JSON}}
  const [{{.JSON}}List, setList] = useState<{{.Name}}[]>([]);

  // Loading and Error flags for the template
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // This is use to animate the input text field
  const [wiggleError, setWiggleError] = useState(false);

  // Two separate views. 1. List view for todo {{.JSON}} & 2. Search result view
  type viewModeType = 'list' | 'search';
  const [viewMode, setViewMode] = useState<viewModeType>('list');

  // Fetch List
  /*
   'fetchList{{.NamePlural}}' is the first method that's called when the component is mounted from the useEffect below.
   This sets some of the state like 'isLoading' and 'isError' before it fetches for data from the endpoint defined under 'pages/api/{{.JSON}}/index'.
   The api endpoint returns a json with the key 'result' and a status 200 if successful or returns a status 500 along with the 'error' key.
   If the 'result' key is present we safely set the '{{.JSON}}List'.
  */
  const fetchList{{.NamePlural}} = () => {
    setIsLoading(true);
    setIsError(false);

    fetch('/api/{{.JSON}}?limit=10')
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.result) {
          setViewMode('list');
          setList(data.result);
        } else {
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  // Load the initial list of {{.JSON}}
  useEffect(() => {
    fetchList{{.NamePlural}}();
  }, []);

  // Add a new {{.NameDecap}}
  /*
  'add{{.Name}}' takes the 'textInput' state, creates a '{{.Name}}' & converts it to a JSON.
  Sends it over as body payload to the api endpoint; which is how the api expects and is defined in 'pages/api/{{.JSON}}' 'POST' switch.
  */
  const add{{.Name}} = (data: any) => {
    setIsLoading(true);

    fetch('/api/{{.JSON}}', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      setIsLoading(false);
      fetchList{{.NamePlural}}();
    });
  };

  // Delete {{.NameDecap}}
  /*
  'delete{{.Name}}' requires an id value of the {{.Name}}. When the user presses the 'delete'(cross) button from a {{.Name}}, this method is invoked.
  It calls the endpoint 'api/{{.JSONSingular}}/<id>' with the 'DELETE' method. Read the method 'handleDelete' under pages/api/{{.JSONSingular}}/[id]' to learn more how the api handles deletion.
  */
  const delete{{.Name}} = (id?: {{.Name}}["id"]) => {
    setIsLoading(true);

    fetch('/api/{{.JSONSingular}}/' + id, {
      method: 'DELETE'
    }).then(() => {
      setIsLoading(false);
      if (viewMode == 'list') {
        fetchList{{.NamePlural}}();
      } else {
        searchQuery();
      }
    });
  };

  // Update {{.NameDecap}} (mark complete/incomplete)
  /*
  'update{{.Name}}' takes the {{.Name}} object, inverts the 'completed' boolean and calls the same endpoint as 'deletion' but with a different method 'PUT'.
  Navigate to 'api/{{.NameDecap}}/[id]' and read more how the api handles updates under the 'handlePut' method.
  */
  const update{{.Name}} = ({{.NameDecap}}: {{.Name}}) => {
    setIsLoading(true);

    fetch('/api/{{.NameDecap}}/' + {{.NameDecap}}.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({{.NameDecap}})
    }).then(() => {
      setIsLoading(false);
      if (viewMode == 'list') {
        fetchList{{.NamePlural}}();
      } else {
        searchQuery();
      }
    });
  };

  // Search query
  /*
  'searchQuery' method takes the state from 'textInput' and send it over to the 'api/{{.JSON}}/search' endpoint via a query param 'q'.
  The response is the same as the response from "fetch('/api/{{.JSON}}')", an array of {{.NamePlural}} if successful.
  */
  const searchQuery = () => {
    if (queryCheckWiggle()) {
      return;
    }
    setIsLoading(true);

    fetch(`/api/{{.JSON}}/search?q=${encodeURI(textInput)}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.result) {
          setViewMode('search');
          setList(data.result);
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
        <h2>{{$dbname}} using Next.js 13 and Tigris</h2>

        <Menu />

        {/* Search Header */}
        <div className="searchHeader">
          <input
            className={`searchInput ${wiggleError ? 'invalid' : ''}`}
            value={textInput}
            onChange={e => {
              setWiggleError(false);
              setTextInput(e.target.value);
            }}
            placeholder="Type an {{.Name}} to add or search"
          />
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
                fetchList{{.NamePlural}}();
              }}
            >
              Go back to list
            </button>
          )}

          {/* {{.Name}} List */}
          { {{- .JSON}}List.length < 1 ? (
            <p className="no{{.NamePlural}}">
              {viewMode == 'search' ? 'No {{.JSON}} found.. ' : 'Add an {{.NameDecap}} by typing in the field above and hit Add!'}
            </p>
          ) : (
            <ul>
              { {{- .JSON}}List.map(each => {
                return (
                  <Each
                    key={each.id}
                    {{.NameDecap}}={each}
                    deleteHandler={delete{{.Name}}}
                    updateHandler={update{{.Name}}}
                  />
                );
              })}
            </ul>
          )}
        </div>
        <div>
          <Form schema={JSON.parse(`{{.JSONSchema}}`)} validator={validator}
                onSubmit={(event) => add{{.Name}}(event.formData)} />
        </div>
        <a href="https://tigrisdata.com/">
          <Image src="/tigris_logo.svg" alt="Tigris Logo" width={100} height={100} />
        </a>
      </div>
    </div>
  );
};

export default Home;
{{end}}