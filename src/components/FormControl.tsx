import { useState } from 'react'

interface IProp {
    title: string
    options: string[]
}

function FormControl(props: IProp) {

    const [isDrop, setIsDrop] = useState<boolean>(false)

    return (
        <div className="relative w-[100%]">
            <button id="dropdownHoverButton" onClick={() => {
                setIsDrop(!isDrop)
            }} data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" className="text-black w-max border-[2px] border-[#000] text-[13px] rounded-md px-5 py-[0.5rem] text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:p-2 sm:w-[100%]" type="button">{props.title}<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            {
                isDrop &&
                <div id="dropdownHover" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                        {props.options.map((i,index) => {
                            return <li key={index}>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{i}</a>
                            </li>
                        })}
                    </ul>
                </div>
            }
        </div>
    )
}

export default FormControl
