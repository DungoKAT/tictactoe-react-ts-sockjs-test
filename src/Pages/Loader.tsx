import { Blocks } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Blocks
                height="200"
                width="200"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
            />
        </div>
    );
};

export default Loader;
