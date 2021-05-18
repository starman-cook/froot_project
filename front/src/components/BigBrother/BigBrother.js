import React, {useState, useEffect} from 'react'
import './BigBrother.css'
import axios from 'axios'
import {apiURL} from "../../config";

const BigBrother = () => {
    const [loader, setLoader] = useState(false)

////////// TEST USER, CHANGE FOR A REAL ONE
    const user = {
        "_id": "60a3a4bd7da1a70838b69b72",
        "workEmail": "mail@mail.mail",
        "password": "12345a",
        "name": "name",
        "surname": "surname",
        "position": "director",
        "telegramName": "TelegaName",
        "phone": "12334454768",
        "role": ["asd", "sdf"],
        "token": "wefwefwef21",
        "patronymic": "Some"
    }

    function getDisplayMedia(options) {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia(options)
        }
        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia(options)
        }
        if (navigator.webkitGetDisplayMedia) {
            return navigator.webkitGetDisplayMedia(options)
        }
        if (navigator.mozGetDisplayMedia) {
            return navigator.mozGetDisplayMedia(options)
        }
        throw new Error('getDisplayMedia is not defined')
    }

    function getUserMedia(options) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(options)
        }
        if (navigator.getUserMedia) {
            return navigator.getUserMedia(options)
        }
        if (navigator.webkitGetUserMedia) {
            return navigator.webkitGetUserMedia(options)
        }
        if (navigator.mozGetUserMedia) {
            return navigator.mozGetUserMedia(options)
        }
        throw new Error('getUserMedia is not defined')
    }

    async function takeScreenshotStream() {
        // eslint-disable-next-line no-restricted-globals
        const width = screen.width * (window.devicePixelRatio || 1)
        // eslint-disable-next-line no-restricted-globals
        const height = screen.height * (window.devicePixelRatio || 1)
        const errors = []
        let stream
        try {
            stream = await getDisplayMedia({
                audio: false,
                video: {
                    width: width,
                    height: height,
                    frameRate: 1,
                },
            })
        } catch (ex) {
            errors.push(ex)
            setLoader(false)
        }

        if (navigator.userAgent.indexOf('Electron') >= 0) {
            try {
                stream = await getUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            minWidth         : width,
                            maxWidth         : width,
                            minHeight        : height,
                            maxHeight        : height,
                        },
                    },
                })
            } catch (ex) {
                errors.push(ex)
            }
        }

        if (errors.length) {
            console.debug(...errors)
            if (!stream) {
                throw errors[errors.length - 1]
            }
        }

        return stream
    }

    async function takeScreenshotCanvas() {
        const stream = await takeScreenshotStream()
        const video = document.createElement('video')
        const result = await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => {
                video.play()
                video.pause()
                const canvas = document.createElement('canvas')
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                const context = canvas.getContext('2d')
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
                resolve(canvas)
            }
            video.srcObject = stream
        })

        stream.getTracks().forEach(function (track) {
            track.stop()
        })

        if (result == null) {
            throw new Error('Cannot take canvas screenshot')
        }

        return result
    }

    function getJpegBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => resolve(blob), 'image/jpeg', 11200)
        })
    }

    async function takeScreenshotJpegBlob() {
        // setLoader(true)
        const canvas = await takeScreenshotCanvas()
        return getJpegBlob(canvas)
    }

    ///////////////////////
    let error = null
    const [infoBB, setInfoBB] = useState({
        merchant: ""
    })
    ///////////////////////
    const checkIfLast = async () => {
        try {
                const response = await axios.get(apiURL + "/bigBrother/lastJob")
                if (response.data.startScreen) {
                    setIsStarted(true)
                    setInfoBB(response.data)
                } else {
                    setIsStarted(false)
                    setInfoBB({merchant: ""})
                }
        } catch (err) {
            console.log(err)
        }

    }

    //////////////
    const inputMerchant = (event) => {
        setInfoBB(prevState => {
            return {...prevState, [event.target.name]: event.target.value}
        })
    }
    const bigBrotherDoYourJob = async () => {
        setLoader(true)
        const screenshotJpegBlob = await takeScreenshotJpegBlob()
            try {
                const formdata = new FormData()
                formdata.append("image", screenshotJpegBlob)
                formdata.append("merchant", infoBB.merchant)
                formdata.append("user", user._id)
                await axios.post(apiURL + '/bigBrother', formdata)
                toggleIsStarted()
                error = null
                setLoader(false)
            } catch {
                error = "No internet connection(((("
            }
    }


    const [isStarted, setIsStarted] = useState(false)
    const toggleIsStarted = () => {
        if (!error) {
            setIsStarted(!isStarted)
        }
    }

    useEffect(() => {
        checkIfLast()
    }, [])

    return (
        <div className={"BigBrother__bg--top"}>
            {!isStarted ? <input required value={infoBB.merchant} name={"merchant"} onChange={(event) => {inputMerchant(event)}} placeholder={"merchant"} className={"BigBrotherInput"} type={"text"} /> : null}
            {infoBB.merchant.length && isStarted ? <p className={"BigBrother__merchant"}>{infoBB.merchant}</p> : null}

            {/*<div onClick={bigBrotherDoYourJob} id={"BigBrother"} style={isStarted ? {'background': 'red'} : {'background': 'green'}} className={"BigBrother"}>*/}
            <div onClick={bigBrotherDoYourJob} id={"BigBrother"} className={"BigBrother"}>
                <img className={"BigBrother__image"} src={isStarted ? "./red.gif" : "./green.gif"} />
                {!error ? <h1 className={"BigBrother__text"}>{isStarted ? "STOP" : "START"}</h1>
                    : <h1 className={"BigBrother__text"}>{error}</h1>}
                </div>
            {loader ? <div className={"Loader"} /> : null}
        </div>
    )
}


export default BigBrother