import {useState, useEffect} from 'react';

const useFetch = (url) => {
    const [data,setData]  = useState();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        setLoading(true);
        fetch(url)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            }
            throw new Error('Network response was not ok')
        })
        .then(data => {
            setData(data)
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setError(err)
        })
    },[])

    return [data,loading,error]
}
export default useFetch;
