"use client"
import React, { useEffect, useRef, useState } from 'react';
import api from '@/utils/api';
export default function Tests() {
  const [file, setFile] = useState()
  const onsubmit = async (e) => {
    e.preventDefault()
    if(file) {
      const data = new FormData()
      data.append('file', file)
      // const fetchConfig = {
      //   method: 'POST',
      //   body: data
      // }
      // console.log("fetch config: ", fetchConfig)
      // fetch("/api/skinDetect", fetchConfig).then(res=> {
      //   console.log("res: ",res)
      // })
      api.postRaw("/api/skinDetect", data).then((res) => {
        console.log("res: ",res)
      })
      
    }

  }

  return (
    <main>
      <form onSubmit={onsubmit} >
        <input type='file' name='file' onChange={(e) => setFile(e.target.files[0])} />
        <input type='submit' value="submit" />
      </form>
    </main>
  );
}
