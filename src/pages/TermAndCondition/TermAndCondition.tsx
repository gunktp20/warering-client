import React from "react";
import { BigNavbar } from "../Landing";
import Wrapper from "../../assets/wrappers/TermAndCondition";

function TermAndCondition() {
  return (
    <Wrapper>
      <div className="bg-white p-[2rem] w-[700px]">
        <div className="text-[#3173b1] font-bold text-[25px] mb-8">Terms and Conditions</div>
        <div className="bg-[#fcfcfc] p-5 overflow-y-auto h-[400px]">
          <div className="font-bold text-[16px] text-[#7a7a7a] mb-3">
            Privacy Policy
          </div>
          <p className="text-[#7a7a7a] mb-5 text-sm">
            This page informs you of our policies regarding the collection, use,
            and disclosure of personal information we receive from users of the
            Service. We use your personal information only to provide and
            improve the service. By using the Service, you agree to the
            collection and use of information in accordance with this Policy.
          </p>

          <div className="font-bold text-[16px] text-[#7a7a7a] mb-3">
            Information Collection And Use
          </div>

          <p className="text-[#7a7a7a] mb-5 text-sm">
            While using our Service, we may ask you to provide us with certain
            personally identifiable information that can be used to contact or
            identify you. Personally identifiable information may include, but
            is not limited to your name and e-mail address (“Personal
            Information”). If you correspond with us by email, we may retain the
            content of your email messages, your email address and our
            responses. We also retain other information (such as data files,
            written text, computer software, music, audio files or other sounds,
            photographs, videos or other images) you post to the Service.
          </p>

          <div className="font-bold text-[16px] text-[#7a7a7a] mb-3">
            Security
          </div>

          <p className="text-[#7a7a7a] mb-5 text-sm">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod cupiditate error animi dolorem veniam officia distinctio quam rem cumque earum, dolor, sit vero minima. Sint at, quas, maiores impedit debitis eaque quis voluptatibus libero ex fugit animi unde ipsum esse veritatis qui accusamus. Qui a sapiente ex velit? Voluptates, velit?
          </p>
        </div>
      </div>
    </Wrapper>
  );
}

export default TermAndCondition;
