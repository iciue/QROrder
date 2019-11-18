import React, {useState, useEffect, useReducer} from 'react';

const dataFetcherReducer = (state, action) => {

}

const useFetch = (initialData, initialUrl) => {
  const [url, setUrl] = useState(initialUrl)
  const [state, dispatch] = useReducer(dataFetcherReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  })

  useEffect(()=> {
    const fetchData = async () => {
      dispatch({type: 'INITIAL_FETCH'})
      try {
        const ret = await axios(url, {})
        dispatch({type: 'FETCH_SUCCESS', payload: ret.data})
      } catch (error) {
        dispatch({type: 'FETCH_FAILURE'})
      }
    }
    fetchData()
  }, [url])

  return [{state}, setUrl]
}
