import React from 'react'
import Link from 'next/link'

const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
export default () => (
  <nav className='nav'>
    <ul>
      <li>
        <Link href='/'>Home</Link>
      </li>
      <li>
        <Link href='/dogs'>Dogs</Link>
      </li>
      <li>
        <Link href='/dogs/shepherd'>Only Shepherds</Link>
      </li>
    </ul>
    <ul>{listItems}</ul>
  </nav>
)
