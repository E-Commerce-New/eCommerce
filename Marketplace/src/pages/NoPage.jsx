const NoPage = () => {
    return (
        <>
            <div
                className="bg-red-500 p-5 text-white font-mono text-2xl w-[50%] text-center ml-[25%] mt-52 animate-bounce">
                <h1>404 not found!</h1>
                <button onClick={() => history.back()}>Go back to home page</button>
            </div>
        </>
    )
}

export default NoPage;