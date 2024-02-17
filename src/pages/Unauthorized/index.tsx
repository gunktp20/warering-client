import { Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/Unauthorized';
import img from "../../assets/images/401 Error Unauthorized-rafiki.svg"
const NotFound = () => {

    return (
        <Wrapper>
            <div>
                <img src={img} alt='not found' className='w-[400px] h-[400px]' />
                <div className='text-[#303030] mb-3 text-[20px]'>Unauthorized</div>
                <div className='text-[#838383]'>Sorry! you are not authorized to access this page</div>
                <div className='mt-8'>
                    <Link to='/landing' className="px-9 py-2 text-[#45a2f9] capitalize rounded-md border-[#45a2f9] border-[2px] hover:bg-[#45a2f9] hover:text-white">back home</Link>
                </div>
            </div>
        </Wrapper>
    );

};
export default NotFound;