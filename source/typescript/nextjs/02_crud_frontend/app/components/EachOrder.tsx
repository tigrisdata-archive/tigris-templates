'use client';

import Image from 'next/image';
import React from 'react';
import { Order } from '../../models/tigris/{{.ProjectName}}/orders';

type Props = {
  order: Order;
  deleteHandler: (id?: Order["id"]) => void;
  updateHandler: (item: Order) => void;
};
const EachOrder = ({ order, deleteHandler, updateHandler }: Props) => {
  return (
    <>
      <li className="each">
        <button
          className="eachButton"
          onClick={() => {
            updateHandler(order);
          }}
        >

          <span>{order.id}</span>
        </button>
        <button
          className="deleteBtn"
          onClick={() => {
            deleteHandler(order.id);
          }}
        >
          <Image src="/delete.svg" width={24} height={24} alt="Check Image" />
        </button>
      </li>
    </>
  );
};

export default EachOrder;
