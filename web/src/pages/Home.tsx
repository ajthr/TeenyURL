import React, { useState, useEffect } from 'react'

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import axios from 'axios';

const Home = () => {

    const [tab, settab] = useState(0)
    const [user, setuser] = useState(0)
    const [urls, seturls] = useState<any[]>([])
    const [url, seturl] = useState("")
    const [alias, setalias] = useState("")
    const [shortUrl, setshortUrl] = useState("")
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [toast, settoast] = useState(0)
    const [toasttext, settoasttext] = useState("")

    const baseUri = "http://localhost"

    const fetchUrls = async () => {
        await axios.get(baseUri + "/api/v1/urls/")
            .then((res) => {
                seturls(res.data)
            })
    }

    const showToast = (text: string) => {
        settoasttext(text)
        settoast(1)
    }

    const shortenUrl = () => {
        axios.post(baseUri + "/api/v1/urls/create/", {
            "url": alias,
            "source": url
        }).then((res) => {
            setshortUrl("http://teenyurl.ml/" + res.data.url)
        }).catch((err: any) => console.log(err))
        fetchUrls()
    }

    const updateProfile = () => {
        axios.post(baseUri + "/api/v1/users/update/", {
            "name": name,
            "email": email
        }).then((res) => {
            console.log("done")
        }).catch((err: any) => console.log(err))
    }

    const signout = () => {
        axios.post(baseUri + "/api/v1/users/signout/")
            .then(() => {
                setuser(0)
            }).catch((err: any) => console.log(err))
    }

    const handleGoogleLogin = (googleData: any) => {
        axios.post(baseUri + "/api/v1/users/signin/", {
            "name": googleData.profileObj.givenName + googleData.profileObj.familyName,
            "email": googleData.profileObj.email
        }).then((res) => {
            setuser?.(1);
            setname(res.data.name)
            setemail(res.data.email)
        }).catch((err: any) => console.log(err))
        fetchUrls()
    }

    const handleFacebookLogin = (facebookData: any) => {
        axios.post(baseUri + "/api/v1/users/signin/", {
            "name": facebookData.name,
            "email": facebookData.email
        }).then((res) => {
            setuser?.(1);
            setname(res.data.name)
            setemail(res.data.email)
        }).catch((err: any) => console.log(err))
        fetchUrls()
    }

    useEffect(() => {
        axios.get(baseUri + "/api/v1/users/")
            .then((res) => {
                if (res.data) {
                    setuser(1)
                    setname(res.data.name)
                    setemail(res.data.email)
                }
            }).catch((err: any) => console.log(err))
        if (user === 1) {
            fetchUrls()
        }
    }, [user])

    return (
        <div className="container">
            <div id="logo"><span className="logo">teeny</span></div>
            <div className="leftbox">
                <nav>
                    <span className={tab === 0 ? "active" : ""} onClick={() => settab(0)} ><i className="fas fa-compress"></i></span>
                    {user === 1 && <span className={tab === 1 ? "active" : ""} onClick={() => settab(1)} ><i className="fas fa-list-ul"></i></span>}
                    <span className={tab === 2 ? "active" : ""} onClick={() => settab(2)} ><i className="fa fa-user"></i></span>
                </nav>
            </div>
            <div className="rightbox">
                {tab === 0 && <div className="tab">
                    <div className="form-group mt-7">
                        <label className="fw-bold"><i className="far fa-keyboard mx-1"></i> Enter a long URL to make a TeenyURL </label>
                        <input type="text" className="form-control w-75 my-3 shadow-none fst-italic" onChange={(e) => seturl(e.target.value)} placeholder="url" autoComplete="off" />
                    </div>
                    <div className="form-group my-1">
                        <label className="fw-bold"> <i className="fas fa-magic mx-1"></i> Customize your link </label>
                        <input type="text" className="form-control w-75 my-3 shadow-none fst-italic" onChange={(e) => setalias(e.target.value)} placeholder="alias" autoComplete="off" />
                    </div>
                    <div className="ms-5">
                        <span className="fw-bold fst-italic text-primary">{shortUrl}</span>
                    </div>
                    <div className="form-group ms-7">
                        <button onClick={() => shortenUrl()} className="btn btn-info text-white mt-3">Make TeenyURL</button>
                    </div>
                </div>}

                {tab === 1 && <div className="tab">
                    <div className="row d-flex mt-5">
                        <div className="">
                            <div className="">
                                <div className="">
                                    <h4 className="fs-4 mb-2">Your TeenyURLs</h4>
                                </div>
                                <ul className="list-style-none overflow-scroll list-container">
                                    {urls.map((item) => {
                                        return (
                                            <li className="py-3 shadow-sm" key={item.url}>
                                                <div className="my-2"> <i className="fas fa-globe-americas"></i> <span className="text-primary"> https://teenyurl.ml/{item.url} </span> </div>
                                                <div className="cut-text text-danger"> {item.source} </div>
                                                <div className="d-flex justify-content-start mt-2">
                                                    <a href={"http://teenyurl.ml/" + item.url} className="btn text-dark shadow mx-1">
                                                        <i className="fas fa-external-link-alt"></i>&nbsp;visit
                                                    </a>
                                                    <button onClick={() => {
                                                        navigator.clipboard.writeText("http://teenyurl.ml/" + item.url);
                                                        showToast("copied!")
                                                    }} className="btn shadow mx-1">
                                                        <i className="far fa-copy"></i>&nbsp;copy
                                                    </button>
                                                </div>
                                            </li>
                                        )
                                    })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>}

                {tab === 2 && <div className="tab">
                    {user === 0 && <div className="login mt-14">
                        <GoogleLogin
                            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                            onSuccess={handleGoogleLogin}
                            onFailure={handleGoogleLogin}
                            cookiePolicy={'single_host_origin'}
                            className="google-login-btn justify-content-center"
                        />
                        <FacebookLogin
                            appId={`${process.env.REACT_APP_FACEBOOK_CLIENT_ID}`}
                            textButton="Sign in with facebook"
                            fields="name,email,picture"
                            callback={handleFacebookLogin}
                            icon={<span><i className="fab fa-facebook-f fs-5 px-2"></i></span>}
                            cssClass="facebook-login-btn"
                        />
                    </div>}
                    {user === 1 && <div>
                        <div className="form-group mt-7">
                            <label className="fw-bold"> <i className="fas fa-signature mx-1"></i> Name </label>
                            <input type="text" className="form-control w-75 my-3 shadow-none fst-italic" name="Name" onChange={(e) => setname(e.target.value)} value={name} autoComplete="off" />
                        </div>
                        <div className="form-group my-1">
                            <label className="fw-bold"> <i className="fas fa-at mx-1"></i> Email </label>
                            <input type="text" className="form-control w-75 my-3 shadow-none fst-italic" value={email} disabled />
                        </div>
                        <div className="form-group">
                            <button onClick={() => updateProfile()} className="btn btn-info text-white mx-2 mt-3">Update Profile</button>
                            <button onClick={() => signout()} className="btn btn-danger text-white mx-2 mt-3">Signout</button>
                        </div>
                    </div>}
                </div>}

            </div>
            {toast === 1 &&
                <div className="toast align-items-center" role="alert">
                    <div className="d-flex">
                        <div className="toast-body">
                            {toasttext}
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Home
