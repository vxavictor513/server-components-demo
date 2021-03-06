/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {fetch} from 'react-fetch';

import {db} from './db.server';
import SidebarNote from './SidebarNote';
import parsePrometheusTextFormat from 'parse-prometheus-text-format';

export default function NoteList({searchText}) {
  const notes = fetch('http://localhost:4000/notes').json();
  const osData = fetch('http://localhost:4000/os').json();
  const currentLoad = fetch('http://localhost:4000/currentLoad').json();
  // const memData = fetch('http://localhost:4000/mem').json();
  // const memPercent = 100 - memData.free / memData.total * 100;
  const metricsData = fetch('http://localhost:4000/metrics').text();
  const memoryUsage = parsePrometheusTextFormat(metricsData).find(x => x.name == 'process_resident_memory_bytes').metrics[0].value;
  const b2s=t=>{let e=Math.log2(t)/10|0;return(t/1024**(e=e<=0?0:e)).toFixed(3)+"BKMGP"[e]};

  const loggingTimestamp = new Date();
  console.log(loggingTimestamp + " Someone is accessing the homepage!")

  // WARNING: This is for demo purposes only.
  // We don't encourage this in real apps. There are far safer ways to access
  // data in a real application!
  // const notes = db.query(
  //   `select * from notes where title ilike $1 order by id desc`,
  //   ['%' + searchText + '%']
  // ).rows;

  // Now let's see how the Suspense boundary above lets us not block on this.
  // fetch('http://localhost:4000/sleep/3000');

  const d1 = new Date(2021, 1, 25)
  const startDate = new Date(d1.getTime(2021, 1, 25) - d1.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
  const d = new Date()
  const currentDate = new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]

  return notes.length > 0 ? (
    <div>
      <p>Platform: {osData.platform}</p>
      <p>Distro: {osData.distro}</p>
      <p>Release: {osData.release}</p>
      <p>Xendit - Trial - Wai Loon - {startDate} - {currentDate}</p>
      <p>CPU Usage: {currentLoad.currentLoad}%</p>
      <p>Memory Usage: {b2s(memoryUsage)}b</p>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id}>
            <SidebarNote note={note} />
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="notes-empty">
      {searchText
        ? `Couldn't find any notes titled "${searchText}".`
        : 'No notes created yet!'}{' '}
    </div>
  );
}
