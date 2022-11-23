'use client';

import Image from 'next/image';
import React from 'react';
{{- $dbname:=.ProjectName -}}
{{with .Collection}}
import { {{.Name}} } from '../../models/tigris/{{$dbname}}/{{.JSON}}';

type Props = {
  {{.NameDecap}}: {{.Name}};
  deleteHandler: (id?: {{.Name}}["id"]) => void;
  updateHandler: (item: {{.Name}}) => void;
};
const Each{{.Name}} = ({ {{.NameDecap}}, deleteHandler, updateHandler }: Props) => {
  return (
    <>
      <li className="each">
        <button
          className="eachButton"
          onClick={() => {
            updateHandler({{.NameDecap}});
          }}
        >

          <span>{ {{- .NameDecap}}.id}</span>
        </button>
        <button
          className="deleteBtn"
          onClick={() => {
            deleteHandler({{.NameDecap}}.id);
          }}
        >
          <Image src="/delete.svg" width={24} height={24} alt="Check Image" />
        </button>
      </li>
    </>
  );
};

export default Each{{.Name}};
{{end}}