export const download = (url, name) => {
    // const [fetching, setFetching] = useState(false);
    // const [error, setError] = useState(false);
    
    if (!url) {
        throw new Error("Resource URL not provided! You need to provide one");
    }
    //setFetching(true);
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            //setFetching(false);
            const blobURL = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobURL;
            a.style = "display: none";
            if (name && name.length) a.download = name;
            document.body.appendChild(a);
            a.click();
        })
        // .catch(() => setError(true));
        .catch((e) => console.log(e))
}; 