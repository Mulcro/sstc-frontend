import {useState, useEffect} from 'react';

const useFetch = (url) => {
    const [data,setData]  = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Had to add state checks to prevent re-rendering as this function is periodically called every 2.5seconds
    useEffect(() => {

        let fetchTimer;

        const fetchData = () => {
            //To prevent unecessary state updates
            if(!loading)
                setLoading(true);

            fetch(url)
            .then(resp => {
                if(resp.ok) {
                    return resp.json()
                }
                return resp.json().then(err => new Error(err.message))
            })
            .then(dataa => {
                setData(dataa)
                setLoading(false)
                setError(null)
                console.log(`Data: ${dataa}`)
                if(fetchTimer){
                    clearInterval(fetchTimer)
                }
            })
            .catch(err => {
                //To prevent unecessary state updates
                if(!(JSON.stringify(err.message) === JSON.stringify(error))){
                    setLoading(false);
                    setError(err.message);
                }
            })
        }

        fetchData();

        fetchTimer = setInterval(fetchData,5000);

        return () => clearInterval(fetchTimer);
    },[])

    return [data,loading,error]
}
export default useFetch;
