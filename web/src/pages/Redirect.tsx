import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import axios from 'axios';

const Redirect = () => {

    const [loading, setloading] = useState(1)

    const baseUri = "http://teenyurl.ml"
    const { url }: { url : string } = useParams();

    const fetchUrl = async () => {
        
        await axios.get(baseUri + "/api/v1/urls/" + url + "/")
            .then((res: any) => {
                window.location.replace(res.data.source)
                setloading(0)
            })
    }

    useEffect(() => {
        fetchUrl()
    }, [])

    return (
        <div className="text-center mt-100">
            {loading === 1 && <i className="fas fa-spinner"></i>}
        </div>
    )
}

export default Redirect
