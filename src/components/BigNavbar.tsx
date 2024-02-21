import React from 'react'

function BigNavbar() {
    return (
        <div className="bg-[#fff] w-[100%] p-3 flex justify-between shadow-sm">
            <div className="text-[#1d4469] font-bold text-[25px] pl-[5.5rem] flex justify-center">
                WR
            </div>
            <div className=" flex items-center pr-[3rem]">
                <div className="text-[14.5px]">Kuttapat Somwang</div>
                <img
                    src={"https://www.wilsoncenter.org/sites/default/files/media/images/person/james-person-1.jpg"}
                    className="ml-5 w-[42px] h-[42px] object-cover rounded-[100px]"
                ></img>
            </div>
        </div>
    )
}

export default BigNavbar
