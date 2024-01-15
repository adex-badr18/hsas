import emptySearchImg from '../assets/images/empty-img.png';

export const EmptySearch = ({ headers, type }) => {
    return (
        <>
            {
                headers &&
                <div className="hidden md:flex justify-between items-center px-6 mt-5">
                    {
                        headers.map((title, index) => (
                            <h3 key={index} className="text-base font-medium text-primary">{title}</h3>
                        ))
                    }
                </div>
            }

            <div className="w-full flex flex-col justify-center items-center mt-10">
                <img src={emptySearchImg} className='w-[200px] mb-8' alt="Woman with a big lens in search of something" />
                <h2 className="text-3xl font-semibold text-center text-[#252D3F] mb-2">OOPS! It's Empty</h2>
                <p className=" text-xl text-center text-[#6E737F]">Looks like you haven't added any {type} yet...!!!</p>
            </div>
        </>
    )
};