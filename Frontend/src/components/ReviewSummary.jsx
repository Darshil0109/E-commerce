/* eslint-disable react/prop-types */
const ReviewSummary = ({reviewSummary , totalReview, averageRating}) => {
  return (
    <div className="w-full my-8 flex flex-col-reverse md:flex-row items-center justify-center lg:gap-4">
        <div className="w-full px-8 lg:my-0 my-8 lg:px-4 lg:w-[45%] lg:ml-16 rounded-2xl">
            {[5,4.5,4,3.5,3,2.5,2].map((rating) => {
                let percentage = (rating !== 2 ?( reviewSummary[rating] / totalReview) : (reviewSummary['2 or below'] / totalReview) )* 100;
                return <div key={rating} className="w-full flex items-center my-3 ">
                    <div className="flex items-center gap-2 w-1/4">
                        <p>{rating !== 2 ? rating : '2 or below'}</p>
                        <i className="fa-solid fa-star text-[#FFD43B]"/>
                    </div>
                    <div className="w-3/4 px-4 ">
                        <div >
                            <div className="relative h-2.5 w-full bg-[#fefbea] rounded-2xl">
                                <div
                                    className={`bg-yellow-400 absolute h-full rounded-2xl` }
                                    style={{ width: `${Math.floor(percentage)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-500">{reviewSummary[`${rating !== 2 ? rating : '2 or below'}`]}</p>
                </div>
            })}
        </div>

        <div className=" flex justify-center items-center flex-col w-11/12 py-16 lg:w-[45%] gap-4 bg-[#fefbea] md:mr-8 lg:mr-16 rounded-2xl">
            <p className="text-5xl font-bold "> {averageRating.toFixed(2)} </p>
            <div className="flex ">
                {[1, 2, 3, 4, 5].map((num) => {
                    return (
                    (averageRating % 1 !== 0) ? 
                        num <= averageRating ?  <i key={num} className={`fas fa-solid fa-star text-[#FFD43B] text-4xl`}/>
                        : ((num - averageRating) >= 0 && (num-averageRating) <=0.5) ? 
                        <div key={num}>
                            <i className="absolute fa-solid fa-star-half text-4xl text-[#FFD43B]" />
                            <i className={`fas fa-solid text-4xl fa-star text-gray-300`}/>  
                        </div>
                        : <i key={num} className={`fas fa-solid text-4xl fa-star text-gray-300`}/>
                    : 
                    (<i key={num} className={`fas fa-solid fa-star text-4xl ${ num <= averageRating ? "text-[#FFD43B]" : "text-gray-300" }`} />)
                    );
                })}
            </div>
            <div className="text-2xl font-semibold">{totalReview} {totalReview > 1 ? 'Reviews' : 'Review'}</div>
        </div>

    </div>
  )
}

export default ReviewSummary