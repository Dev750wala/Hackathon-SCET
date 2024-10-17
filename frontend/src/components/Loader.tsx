const Loader = () => {
    return (
        <div className="flex justify-center items-center fixed inset-0 bg-white bg-opacity-40 backdrop-blur-md z-50" onScroll={(e) => e.preventDefault()}>

            <div className="flex items-center space-x-2">
                <span className="inline-block w-[3px] h-[20px] bg-black rounded-full animate-scale-up"></span>
                <span className="inline-block w-[3px] h-[35px] bg-black rounded-full animate-scale-up delay-100"></span>
                <span className="inline-block w-[3px] h-[20px] bg-black rounded-full animate-scale-up delay-200"></span>
                <span className="inline-block w-[3px] h-[20px] bg-black rounded-full animate-scale-up delay-300"></span>
                <span className="inline-block w-[3px] h-[35px] bg-black rounded-full animate-scale-up delay-500"></span>
                <span className="inline-block w-[3px] h-[20px] bg-black rounded-full animate-scale-up delay-700"></span>
            </div>
        </div>

    )
}

export default Loader