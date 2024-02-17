import { Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/NotFound';
// import img from '../assets/images/not-found.svg';
import img from "../../assets/images/404 Error Page not Found with people connecting a plug-amico.svg"
const NotFound = () => {

    return (
        <Wrapper>
            <div>
                <img src={img} alt='not found' className='w-[400px] h-[400px]' />
                <div className='text-[#303030] mb-3 text-[20px]'>Ohh! page not found</div>
                <div className='text-[#838383]'>we can't seem to find the page you are looking for</div>
                <div className='text-[#45a2f9] mt-8'>
                    <Link to='/landing' className="px-9 py-2 rounded-md text-white border-[#45a2f9] border-[2px] hover:bg-[#45a2f9] hover:text-white">back home</Link>
                </div>
            </div>
        </Wrapper>
    );

};
export default NotFound;